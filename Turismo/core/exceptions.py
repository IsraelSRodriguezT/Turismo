from __future__ import annotations

from collections.abc import Mapping

from django.http import Http404
from rest_framework import status as drf_status
from rest_framework.exceptions import AuthenticationFailed, NotAuthenticated, PermissionDenied, ParseError, ValidationError
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler


def _flatten_detail(detail, prefix: str = "") -> list[dict[str, str]]:
	if isinstance(detail, Mapping):
		items: list[dict[str, str]] = []
		for field, value in detail.items():
			new_prefix = f"{prefix}.{field}" if prefix else str(field)
			items.extend(_flatten_detail(value, new_prefix))
		return items
	if isinstance(detail, list):
		items: list[dict[str, str]] = []
		for value in detail:
			items.extend(_flatten_detail(value, prefix or "non_field_errors"))
		return items
	field = prefix or "non_field_errors"
	return [{"field": field, "message": str(detail)}]


def _error_code(exc, status_code: int) -> str:
	if isinstance(exc, ValidationError):
		return "VALIDATION_ERROR"
	if isinstance(exc, (NotAuthenticated, AuthenticationFailed)):
		return "UNAUTHORIZED"
	if isinstance(exc, PermissionDenied):
		return "FORBIDDEN"
	if isinstance(exc, (Http404,)):
		return "NOT_FOUND"
	if isinstance(exc, ParseError):
		return "BAD_REQUEST"
	if status_code == drf_status.HTTP_409_CONFLICT:
		return "CONFLICT"
	if status_code >= 500:
		return "INTERNAL_SERVER_ERROR"
	return "BAD_REQUEST"


def _message(exc, status_code: int) -> str:
	if isinstance(exc, ValidationError):
		return "Error de validación de campos"
	if isinstance(exc, (NotAuthenticated, AuthenticationFailed)):
		return "Token inválido o expirado"
	if isinstance(exc, PermissionDenied):
		return "Sin permisos suficientes"
	if isinstance(exc, Http404):
		return "Recurso no encontrado"
	if isinstance(exc, ParseError):
		return "Solicitud no válida"
	if status_code >= 500:
		return "Error interno del servidor"
	return "Solicitud no válida"


def pit_exception_handler(exc, context):
	response = drf_exception_handler(exc, context)
	if response is None:
		return response

	status_code = response.status_code
	if isinstance(exc, ValidationError):
		status_code = drf_status.HTTP_422_UNPROCESSABLE_ENTITY
		response.status_code = status_code

	details_source = exc.detail if hasattr(exc, "detail") else response.data
	if isinstance(details_source, Mapping) and "detail" in details_source and len(details_source) == 1:
		details = _flatten_detail(details_source["detail"], "detail")
	else:
		details = _flatten_detail(details_source)

	response.data = {
		"success": False,
		"message": _message(exc, status_code),
		"data": None,
		"errors": {
			"code": _error_code(exc, status_code),
			"details": details,
		},
		"meta": {"status_code": status_code},
	}
	return response
