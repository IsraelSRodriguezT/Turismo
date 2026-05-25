from __future__ import annotations

from collections.abc import Mapping

from rest_framework import status as drf_status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets

NORMALIZED_KEYS = {"success", "message", "data", "errors", "meta"}


def is_normalized_payload(payload) -> bool:
	return isinstance(payload, Mapping) and NORMALIZED_KEYS.issubset(payload.keys())


def build_success_payload(data=None, message: str = "Operación realizada exitosamente", meta: dict | None = None):
	return {
		"success": True,
		"message": message,
		"data": data,
		"errors": None,
		"meta": meta or {},
	}


def build_error_payload(errors=None, message: str = "Solicitud no válida", meta: dict | None = None):
	return {
		"success": False,
		"message": message,
		"data": None,
		"errors": errors or {"code": "BAD_REQUEST", "details": []},
		"meta": meta or {},
	}


def _status_message(status_code: int) -> str:
	if status_code == drf_status.HTTP_400_BAD_REQUEST:
		return "Solicitud no válida"
	if status_code == drf_status.HTTP_401_UNAUTHORIZED:
		return "Token inválido o expirado"
	if status_code == drf_status.HTTP_403_FORBIDDEN:
		return "Sin permisos suficientes"
	if status_code == drf_status.HTTP_404_NOT_FOUND:
		return "Recurso no encontrado"
	if status_code >= 500:
		return "Error interno del servidor"
	return "Solicitud no válida"


def _error_code(status_code: int) -> str:
	if status_code == drf_status.HTTP_401_UNAUTHORIZED:
		return "UNAUTHORIZED"
	if status_code == drf_status.HTTP_403_FORBIDDEN:
		return "FORBIDDEN"
	if status_code == drf_status.HTTP_404_NOT_FOUND:
		return "NOT_FOUND"
	if status_code == drf_status.HTTP_409_CONFLICT:
		return "CONFLICT"
	if status_code == drf_status.HTTP_422_UNPROCESSABLE_ENTITY:
		return "VALIDATION_ERROR"
	if status_code >= 500:
		return "INTERNAL_SERVER_ERROR"
	return "BAD_REQUEST"


def _flatten_details(detail, prefix: str = "") -> list[dict[str, str]]:
	if isinstance(detail, Mapping):
		items: list[dict[str, str]] = []
		for field, value in detail.items():
			new_prefix = f"{prefix}.{field}" if prefix else str(field)
			items.extend(_flatten_details(value, new_prefix))
		return items

	if isinstance(detail, list):
		items: list[dict[str, str]] = []
		for value in detail:
			items.extend(_flatten_details(value, prefix or "non_field_errors"))
		return items

	field = prefix or "non_field_errors"
	return [{"field": field, "message": str(detail)}]


def normalize_error_payload_from_response(response) -> dict:
	status_code = getattr(response, "status_code", drf_status.HTTP_400_BAD_REQUEST)
	payload = getattr(response, "data", None)

	if isinstance(payload, Mapping) and is_normalized_payload(payload):
		return dict(payload)

	if isinstance(payload, Mapping) and "errors" in payload and "success" in payload:
		return dict(payload)

	if isinstance(payload, Mapping) and "detail" in payload:
		details = _flatten_details(payload.get("detail"), "detail")
	else:
		details = _flatten_details(payload or [], "non_field_errors")

	return build_error_payload(
		{
			"code": _error_code(status_code),
			"details": details,
		},
		message=_status_message(status_code),
		meta={"status_code": status_code},
	)


class NormalizedResponseMixin:
	def _normalized_meta(self, response):
		return {"status_code": response.status_code}

	def finalize_response(self, request, response, *args, **kwargs):
		response = super().finalize_response(request, response, *args, **kwargs)
		if not isinstance(response, Response):
			return response
		if response.status_code == drf_status.HTTP_204_NO_CONTENT:
			return response
		if is_normalized_payload(response.data):
			return response
		if 200 <= response.status_code < 300:
			response.data = build_success_payload(
				response.data,
				message="Operación realizada exitosamente",
				meta=self._normalized_meta(response),
			)
			return response
		response.data = normalize_error_payload_from_response(response)
		return response


class NormalizedAPIView(NormalizedResponseMixin, APIView):
	pass


class NormalizedModelViewSet(NormalizedResponseMixin, viewsets.ModelViewSet):
	pass


class NormalizedReadOnlyModelViewSet(NormalizedResponseMixin, viewsets.ReadOnlyModelViewSet):
	pass
