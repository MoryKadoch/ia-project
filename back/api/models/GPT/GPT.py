
import openai


def check_image(statement):
    # Initialiser l'API OpenAI
    openai.api_key = "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"

    # Envoyer la declaration a OpenAI pour effectuer la verification des faits
    
    messages = []
    messages.append({"role": "system", "content": "Ton but est de réussir a interpréter un tableau a 2 dimension représentant un chiffre entre 0 et 9. \n\
    La réponse ne sera constituée que de ce chiffre, et uniquement ce chiffre. \n\
    Définitions:\n\
    - un 0 est représenté par un cercle ou un ovale\n\
    - un 1 est représenté par une barre\n\
    - un 2 est représenté par une boucle ouverte et attaché a une barre horizontale droite, en bas\n\
    - un 3 est représenté par 2 demie boucles ouvertes sur la gauche collées l'une a l'autre\n\
    - un 4 est représenté par une croix dont le point le plus haut et celui le plus a gauche sont reliés par un segment\n\
    - un 5 est composé comme un 2 à l'envers\n\
    - un 6 est représenté par un rond surmonté d'une demie boucle ouverte collée au rond sur la gauche\n\
    - un 7 est représenté par une barre droite et une autre barre en diagonale partant du point droit de la barre horizontale\n\
    - un huit est composé de deux ronds collés l'un sur l'autre\n\
    - le 9 est composé comme un 6 à l'envers\n\
    "})

    messages.append({"role": "user", "content": "\
    [[  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0   0  91 244 254 254 115  13   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0   0  99 254 248 216 241 254  96   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0  12 215 254 216   0 128 253 222  31   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0   0 120 254 254 216   0   0 208 254 137   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0   0  71 251 254 147  61   0   0  81 245 184   2   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0  38 232 251 129   0   0   0   0   0 165 254  51   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0   0 117 254 235  22   0   0   0   0   0 114 254 103   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0   0 110 251 199  23   3   0   0   0   0   0 114 254 159   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0  34 216 212  19   0   0   0   0   0   0   0  68 254 197   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0   0 176 254  99   0   0   0   0   0   0   0   0  19 254 197   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0  73 248 176   0   0   0   0   0   0   0   0   0  19 255 198   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   2 182 247  85   0   0   0   0   0   0   0   0   0  10 215 197   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0  13 254 133   0   0   0   0   0   0   0   0   0   0  15 237 193   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0 131 254  50   0   0   0   0   0   0   0   0   0   0  83 254 103   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0 198 166   2   0   0   0   0   0   0   0   0   0   0 130 254  51   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0 198  92   0   0   0   0   0   0   0   0   0   0 123 245 177   2   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0 198 203   7   0   0   0   0   0   0  13  89 179 248 247  50   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0 177 254 193 151 151 130 137 151 176 246 254 254 204  61   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0  19 213 254 254 254 254 254 254 254 254 231 162  23   0   0   0   0   0   0   0   0   0]\n\
     [  0   0   0   0   0   0   0  44 118 159 159 229 170 254 160 111  15   0   0   0   0   0   0   0   0   0   0   0]\n\
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