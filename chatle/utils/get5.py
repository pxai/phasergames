from unidecode import unidecode

# input_file_path = "0_palabras_todas.txt"   # Path to the input file
input_file_path = "fr.js"   # Path to the input file
output_file_path = "words_fr.js" # Path to the output file

# Read words from input file
with open(input_file_path, "r") as input_file:
    words = input_file.read().split()

# Select words with 5 characters
selected_words = [word for word in words if len(word) == 5]

# Write selected words to output file
with open(output_file_path, "w") as output_file:
    for word in selected_words:
        output_file.write("'" + unidecode(word) + "',\n")

print("Selected words written to", output_file_path)