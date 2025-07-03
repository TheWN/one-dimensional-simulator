
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt


def rule_step(row, rule_number):
    new_row = []
    for i in range(len(row)):
        left = row[i - 1] if i > 0 else 0 
        center = row[i]
        right = row[i + 1] if i < len(row) - 1 else 0
        triplet = (left << 2) | (center << 1) | right #OR left*4 center*2 right and they will +
        # new_row.append(ruleset[triplet])
        new_cell= 1 if triplet in [1,2,3,5,6,7] else 0 #rule110, 4 and 0 is 0
        new_row.append(new_cell)
    return new_row


@csrf_exempt # have no idea 
def rule110_api(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        import json
        data = json.loads(request.body)
        initial_str = data.get('initial')
        rule = int(data.get('rule'))
        steps = int(data.get('steps'))

        current = [int(c) for c in initial_str]
        generations = [current]

        for _ in range(steps):
            current = rule_step(current, rule)
            generations.append(current)

        return JsonResponse({'generations': generations})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    

#for 256 rules? 
'''
from django.http import JsonResponse
import json

def rule_step(row, rule_number):
    ruleset = [(rule_number >> i) & 1 for i in range(7, -1, -1)]  # تبدیل به دودویی
    new_row = []
    for i in range(len(row)):
        left = row[i - 1] if i > 0 else 0
        center = row[i]
        right = row[i + 1] if i < len(row) - 1 else 0
        triplet = (left << 2) | (center << 1) | right
        new_row.append(ruleset[triplet])
    return new_row
'''
