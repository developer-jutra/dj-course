from dataclasses import dataclass
from prettytable import PrettyTable

def ascii_bar(value, max_value, length=20):
    bar_length = int(length * value / max_value)
    return "#" * bar_length + "-" * (length - bar_length)

@dataclass
class ItemValue:
    item: str
    value: int

@dataclass
class Labels:
    item: str
    value: str
    graphical: str

data: list[ItemValue] = [
    ItemValue(item="Item A", value=30),
    ItemValue(item="Item B", value=70),
    ItemValue(item="Item C", value=50),
]

def ascii_table(data: list[ItemValue], labels: Labels = Labels("Item", "Value", "Graphical")):
    max_val = max(item.value for item in data)
    table = PrettyTable([labels.item, labels.value, labels.graphical])

    for item in data:
        table.add_row([item.item, item.value, ascii_bar(item.value, max_val)])
    print(table)

if __name__ == "__main__":
    ascii_table(data)
