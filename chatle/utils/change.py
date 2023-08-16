import json
from unidecode import unidecode

input_file_path = "0_palabras_todas.txt"   # Path to the input file
#input_file_path = "en.json"   # Path to the input file
output_file_path = "words_es.js" # Path to the output file

# Read words from input file
with open('0_palabras_todas.txt', 'r') as input_file:
    words = input_file.read().split()

# Write selected words to output file
with open(output_file_path, "w") as output_file:
    for word in words:
        output_file.write("'" + word + "',\n")

print("Selected words written to", output_file_path)