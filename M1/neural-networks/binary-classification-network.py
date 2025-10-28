import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.tensorboard import SummaryWriter
import os

# Config / settings
LOG_DIR = 'runs/binary_classification'
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)
writer = SummaryWriter(LOG_DIR)

# Model definition
class SimpleNN(nn.Module):
    def __init__(self):
        super(SimpleNN, self).__init__()
        self.fc1 = nn.Linear(2, 100)
        self.fc2 = nn.Linear(100, 100)
        self.fc3 = nn.Linear(100, 1)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        # Sigmoid activation for output (binary classification: either 0 or 1)
        x = torch.sigmoid(self.fc3(x))
        return x

model = SimpleNN()
# Fictional input data: 10 samples, 2 features
# X = torch.randn(10, 2, dtype=torch.float32)
# Fictional target data: 10 samples, 1 target
# y = torch.rand(10, 1, dtype=torch.float32)

# Using 20 samples, data is synthetic, creating two easily separable groups.

# 1. Class 0 (Lower group): 10 samples with small values (close to 0)
# Average 0.1, stddev 0.05
X_class_0 = torch.randn(10, 2) * 0.05 + 0.1

# 2. Class 1 (Upper group): 10 samples with large values (close to 1)
# Average 0.9, stddev 0.05
X_class_1 = torch.randn(10, 2) * 0.05 + 0.9

# Merging both classes into one dataset: 20 samples, 2 features each
X = torch.cat((X_class_0, X_class_1), dim=0).float()

# joining 20 targets, 1 target each
y = torch.cat((
    # Target: 10 zeroes for Class 0 and 10 ones for Class 1
    torch.zeros(10, 1),
    torch.ones(10, 1)
), dim=0).float()

# Criterion - Binary Cross Entropy Loss
criterion = nn.BCELoss()
# SGD - Stochastic Gradient Descent Optimizer
# optimizer = optim.SGD(model.parameters(), lr=0.01)
# Adam
optimizer = optim.Adam(model.parameters(), lr=0.01)

# Model architecture logging (to visualize in TensorBoard, only once at the start)
writer.add_graph(model, X)

NUM_EPOCHS = 100

# Training loop
print(f"Rozpoczynanie treningu przez {NUM_EPOCHS} epok...")

for epoch in range(NUM_EPOCHS):
    # gradient zeroing
    optimizer.zero_grad()

    # Forward pass
    output = model(X)
    loss = criterion(output, y)

    # backpropagation (calculating gradients)
    loss.backward()

    # Visualizing Loss and Gradients for the current epoch (global_step=epoch)
    if (epoch + 1) % 5 == 0:
        # Visualising Loss (on a scalar plot)
        writer.add_scalar('Loss', loss.item(), epoch)
        
        # Wizualizacja Gradientów (na wykresach histogramowych)
        # Zapis gradientów po loss.backward()
        if model.fc1.weight.grad is not None:
            writer.add_histogram('Gradients/Layer_FC1_Weights', model.fc1.weight.grad, epoch)
        if model.fc2.weight.grad is not None:
            writer.add_histogram('Gradients/Layer_FC2_Weights', model.fc2.weight.grad, epoch)
        # Visualizing Weights (for FC1 layer)
        writer.add_histogram('Weights/FC1', model.fc1.weight.data, epoch)
        # Visualizing Weights (for FC2 layer)
        writer.add_histogram('Weights/FC2', model.fc2.weight.data, epoch)

    # Uptade weights
    optimizer.step()

    if (epoch + 1) % 5 == 0:
        print(f"Epoka [{epoch+1}/{NUM_EPOCHS}], Strata: {loss.item():.4f}")

MODEL_PATH = "binary_classification_model_weights.pth"
torch.save(model.state_dict(), MODEL_PATH)
print(f"Model zapisany jako: {MODEL_PATH}")

print("Zakończono zapis logów do TensorBoard.")
writer.close()

print(f"(run tensorboard/venv): tensorboard --logdir={LOG_DIR}")
print(f"(run tensorboard/venv): tensorboard --logdir=runs")
print("\nopen http://localhost:6006/; SCALARS - how loss changed over time; HISTOGRAMS - how gradients distributed over epochs")
