from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import sympy as sp

# Helper function to evaluate a function at a point
def evaluate_function(func_str, x_val):
    x = sp.Symbol('x')
    try:
        func = sp.sympify(func_str)  # Convert string to symbolic expression
        return float(func.subs(x, x_val))
    except Exception as e:
        return None

# Bisection method implementation with iteration tracking
def bisection_method(func_str, xl, xu, error, decimal_digits):
    # Initial checks
    fxl = evaluate_function(func_str, xl)
    fxu = evaluate_function(func_str, xu)
    if fxl is None or fxu is None:
        return {"error": "Invalid function evaluation"}
    if fxl * fxu >= 0:
        return {"error": "Function values at xl and xu must have opposite signs"}

    xr = 0.0
    xrold = 0.0
    error_val = 0.0
    iterations = []
    iteration_count = 0

    while True:
        xrold = xr
        xr = (xl + xu) / 2
        fxr = evaluate_function(func_str, xr)

        # Calculate error (skip for first iteration)
        if iteration_count > 0:
            error_val = abs((xr - xrold) / xr) * 100
        else:
            error_val = ""

        # Store iteration data
        iteration_data = {
            "iteration": iteration_count,
            "xl": round(xl, decimal_digits),
            "f_xl": round(fxl, decimal_digits),
            "xu": round(xu, decimal_digits),
            "f_xu": round(fxu, decimal_digits),
            "xr": round(xr, decimal_digits),
            "f_xr": round(fxr, decimal_digits),
            "error": round(error_val, decimal_digits) if error_val != "" else ""
        }
        iterations.append(iteration_data)

        # Check sign for next step
        if fxl * fxr > 0:
            xl = xr
            fxl = fxr
        elif fxl * fxr < 0:
            xu = xr
            fxu = fxr
        else:
            break  # Exact root found

        iteration_count += 1

        # Stop if error is within tolerance
        if error_val != "" and error_val <= error:
            break

    return {
        "root": round(xr, decimal_digits),
        "iterations": iterations
    }

@csrf_exempt
def calculate_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            func_str = data.get("function")
            xl = data.get("xl")
            xu = data.get("xu")
            error = data.get("error")
            decimal_digits = data.get("decimal_digits")

            if None in [func_str, xl, xu, error, decimal_digits]:
                return JsonResponse({"error": "Missing required fields"}, status=400)

            result = bisection_method(func_str, xl, xu, error, decimal_digits)
            if "error" in result:
                return JsonResponse(result, status=400)

            return JsonResponse(result)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Only POST requests are allowed"}, status=405)

def project(request):
    return render(request, 'pages/bi.html')