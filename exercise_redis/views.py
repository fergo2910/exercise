from django.shortcuts import render
from django.views.generic import TemplateView
from .forms import ProductForm

# Create your views here.
class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'index.html', context=None)

def elements(request):
    if request.method == 'POST':
        form = ProductForm(request.POST)
        if form.is_valid():
            pass  # does nothing, just trigger the validation
    else:
        form = ProductForm()
    return render(request, 'elements.html', {'form': form})
