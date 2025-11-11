import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

def plot_sine_wave(amplitude=1.0, frequency=1.0, period=10.0, num_points=100, title="Sine Wave Plot", xlabel="Time", ylabel="Amplitude"):
    time = pd.Series(np.linspace(0, period, num_points))

    sine_wave = amplitude * np.sin(2 * np.pi * time / period)

    plt.plot(time, sine_wave)

    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.title(title)

    plt.grid(True)

    plt.show()

    print("Done")

plot_sine_wave()
