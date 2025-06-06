import torch 
from app.core.config import settings 
from torchvision import transforms, models 
from PIL import Image 
from app.breed_labels import class_names
import torch.nn as nn

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)

for param in model.parameters():
    param.requires_grad = False
    
model.fc = nn.Linear(model.fc.in_features, len(class_names))

model.load_state_dict(torch.load(settings.model_path, map_location=device))

model.eval() 

def predict_breed(image: Image.Image) -> str:
    
    transform = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.ToTensor(),
    ])
    
    img_tensor = transform(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        output = model(img_tensor)
        pred = output.argmax(dim=1).item() 
        
        
    return class_names[pred]