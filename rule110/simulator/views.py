from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def decimal_to_binary_list(n):
    return [int(x) for x in f"{n:08b}"]

def generate_generations(initial, ruleset, steps):
    generations = []
    current = initial[:]
    generations.append(current)

    for _ in range(steps):
        nextgen = []
        for i in range(len(current)):
            left = current[(i - 1) % len(current)]
            center = current[i]
            right = current[(i + 1) % len(current)]
            index = 7 - (left * 4 + center * 2 + right)
            nextgen.append(ruleset[index])
        generations.append(nextgen)
        current = nextgen
    return generations

@csrf_exempt
def rule110_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        initial_str = data.get('initial')
        rule_number = int(data.get('rule', 110))
        steps = int(data.get('steps', 20))

        initial = [int(c) for c in initial_str.strip()]
        ruleset = decimal_to_binary_list(rule_number)
        result = generate_generations(initial, ruleset, steps)
        return JsonResponse({'generations': result})
    return JsonResponse({'error': 'Only POST allowed'}, status=405)


from django.shortcuts import render
from django.http import HttpResponse

def rule110_view(request):
    rule_number = 110
    ruleset = decimal_to_binary_list(rule_number)
    length = 41
    steps = 30
    initial = [0] * (length // 2) + [1] + [0] * (length // 2)
    generations = generate_generations(initial, ruleset, steps)
    return render(request, 'rule110.html', {'generations': generations})



# Create your views here.
