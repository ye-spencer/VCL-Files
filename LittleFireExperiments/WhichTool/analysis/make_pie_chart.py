import matplotlib.pyplot as plt
import matplotlib as mpl

# Set modern publication-quality style
mpl.rcParams['font.family'] = 'sans-serif'
mpl.rcParams['font.sans-serif'] = ['Arial', 'Helvetica', 'DejaVu Sans', 'Liberation Sans']
mpl.rcParams['font.size'] = 11
mpl.rcParams['axes.linewidth'] = 0.8
mpl.rcParams['axes.spines.top'] = False
mpl.rcParams['axes.spines.right'] = False
mpl.rcParams['figure.dpi'] = 300
mpl.rcParams['figure.facecolor'] = 'white'


data = {
    "Fire Starter": 34,
    "Axe": 18,
    "Machete": 17,
    "Mosquito Net": 7,
    "Metal Pot": 7,
    "Bow and Arrow": 6,
    "Fishing Net": 6,
    "Other: Shovel/Furs/Rope": 5,
}


# Filter out zero values for cleaner visualization
filtered_data = {k: v for k, v in data.items() if v > 0}
labels = list(filtered_data.keys())
values = list(filtered_data.values())

# Color palette for tool categories - using a modern, distinct color scheme
# Muted, harmonious color variants (not exactly the same) for the tools
colors = [
    '#E74C3C',  # Fire Starter - muted red
    '#AEB6BF',  # Axe - light muted blue gray
    '#B2BABB',  # Machete - muted gray teal
    '#B3B6B7',  # Mosquito Net - muted gray
    '#ABB2B9',  # Metal Pot - bluish muted gray
    '#BFC2C4',  # Bow and Arrow - grayish muted
    '#CAC7CE',  # Fishing Net - pale grayish lavender
    '#D5DBDB',  # Other: Shovel/Furs/Rope - very light muted gray
]

# Create figure with appropriate aspect ratio
fig, ax = plt.subplots(figsize=(6, 6), facecolor='white')

# Create pie chart with modern refined styling
wedges, texts, autotexts = ax.pie(
    values,
    labels=labels,
    autopct='%1.1f%%',
    startangle=90,
    colors=colors,
    textprops={'fontsize': 10.5, 'fontfamily': 'sans-serif'},
    wedgeprops={'linewidth': 1.0, 'edgecolor': 'white', 'alpha': 0.95},
    pctdistance=0.82
)

# Refine percentage text appearance
for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontweight('600')
    autotext.set_fontsize(10.5)

# Refine label text appearance
for text in texts:
    text.set_fontsize(11)
    text.set_fontweight('500')

# Title with modern professional styling
ax.set_title("Which tool would you pick?", fontsize=13.5, fontweight='600', pad=18, fontfamily='sans-serif')

# Ensure equal aspect ratio
ax.axis('equal')

# Save with high resolution
plt.tight_layout()
plt.savefig("pie_chart.png", dpi=300, bbox_inches='tight', facecolor='white', edgecolor='none')
plt.close()