from django.shortcuts import render
from django.views.generic import TemplateView
from .forms import ProductForm
import consul
import json

# Create your views here.
class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'index.html', context=None)

def elements(request):
    if request.method == 'POST':
        form = ProductForm(request.POST)
        if form.is_valid():
            pass  # does nothing, just trigger the validation
            data = ProductForm.cleaned_data
            product = data['product']
            price = data['price']
            print(product)
            print(price)
    else:
        form = ProductForm()
    consul_service = consul.Consul(host='consul')
    consul_service_api = consul_service.catalog.service('service_api')
    json_service_str = consul_service_api[1]
    json_service = json.dumps(json_service_str[0])
    data_service = json.loads(json_service)
    print(d["ServiceAddress"])
    print(d["ServicePort"])
    return render(request, 'elements.html', {'form': form})
