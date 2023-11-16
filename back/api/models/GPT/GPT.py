﻿
import openai


def check_image(statement):
    # Initialiser l'API OpenAI
    openai.api_key = "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"

    # Envoyer la declaration a OpenAI pour effectuer la verification des faits
    
    messages = []
    messages.append({"role": "system", "content": "Ton but est de réussir a interpréter un tableau a 2 dimension représentant un chiffre entre 0 et 9. \n\
    La réponse ne sera constituée que de ce chiffre, et uniquement ce chiffre. \n\
    Définitions:\n\
    - 0 : Un cercle parfait, sans angles ni lignes droites, représentant le vide ou l'absence.\n\
    - 1 : Une ligne verticale droite, simple et élancée comme une colonne.\n\
    - 2 : Une forme incurvée avec une courbe douce en haut, rappelant un cygne ou un swanee.\n\
    - 3 : Un chiffre avec une forme courbée, se terminant par une boucle vers le haut.\n\
    - 4 : Une ligne verticale avec une ligne horizontale à mi-chemin, formant un angle net.\n\
    - 5 : Une courbe à mi-chemin entre le cercle et la ligne droite, avec une petite courbe à la base.\n\
    - 6 : Une boucle arrondie s'étendant vers le bas et se courbant vers le haut.\n\
    - 7 : Une ligne verticale avec une petite barre horizontale à mi-hauteur, formant un angle.\n\
    - 8 : Deux cercles superposés ou entrelacés, représentant une double boucle.\n\
    - 9 : Une boucle se penchant vers la gauche avec une queue s'étendant vers le bas.\n\
    "})

    #messages.append({"role": "user", "content": "\
    #[[  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0   0   0   0   0   0  91 244 254 254 115  13   0   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0   0   0   0   0  99 254 248 216 241 254  96   0   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0   0   0   0  12 215 254 216   0 128 253 222  31   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0   0   0   0 120 254 254 216   0   0 208 254 137   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0   0   0  71 251 254 147  61   0   0  81 245 184   2   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0   0  38 232 251 129   0   0   0   0   0 165 254  51   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0   0 117 254 235  22   0   0   0   0   0 114 254 103   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0 110 251 199  23   3   0   0   0   0   0 114 254 159   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0  34 216 212  19   0   0   0   0   0   0   0  68 254 197   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0 176 254  99   0   0   0   0   0   0   0   0  19 254 197   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0  73 248 176   0   0   0   0   0   0   0   0   0  19 255 198   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   2 182 247  85   0   0   0   0   0   0   0   0   0  10 215 197   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0  13 254 133   0   0   0   0   0   0   0   0   0   0  15 237 193   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0 131 254  50   0   0   0   0   0   0   0   0   0   0  83 254 103   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0 198 166   2   0   0   0   0   0   0   0   0   0   0 130 254  51   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0 198  92   0   0   0   0   0   0   0   0   0   0 123 245 177   2   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0 198 203   7   0   0   0   0   0   0  13  89 179 248 247  50   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0 177 254 193 151 151 130 137 151 176 246 254 254 204  61   0   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0  19 213 254 254 254 254 254 254 254 254 231 162  23   0   0   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0  44 118 159 159 229 170 254 160 111  15   0   0   0   0   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
    # [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]]\n\
    # "})

    messages.append({"role": "user", "content": "\
    [[  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0  11 112 228 228  12   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0  51 193 253 253 192   8   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0 121 238 253 244 127  13   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   8 116 254 253 218  50   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0 141 253 254 181  36   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0  95 254 254 182   7   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0  51 231 253 201   7   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0  50 231 253 231  49   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0 163 253 253 137   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0  33 228 253 240  35   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0 149 255 254 159   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0  11 222 254 253 198 145  81  40   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0  64 253 254 253 253 253 253 243 138   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0  38 253 254 249 235 242 253 254 241 186  24   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0  84 253 254 198   0  31 136 254 253 253  87   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0 110 254 255 134   0   0   0 170 254 254 247  47   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0 109 253 254 198   0   0   0  31 243 253 253  72   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0 109 253 254 245  89   0   0   0 190 253 253 105   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0  24 190 254 253 245 193 109 110 224 253 253  72   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0  59 189 253 253 253 253 254 253 253 175  21   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]]\n\
     "})

    response = openai.ChatCompletion.create(
        model="gpt-4-1106-preview",
        messages=messages
    )

    print(response.choices[0].message.content)

check_image("")