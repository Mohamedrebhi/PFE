# # import google.generativeai as genai
# # genai.configure(api_key="AIzaSyBqm2z_pcTDCU0ubeEMidJRohRkXDvlIsg")


# # generation_config = {
# #   "temperature": 1,
# #   "top_p": 0.95,
# #   "top_k": 0,
# #   "max_output_tokens": 8192,
# # }

# # safety_settings = [
# #   {
# #     "category": "HARM_CATEGORY_HARASSMENT",
# #     "threshold": "BLOCK_MEDIUM_AND_ABOVE"
# #   },
# #   {
# #     "category": "HARM_CATEGORY_HATE_SPEECH",
# #     "threshold": "BLOCK_MEDIUM_AND_ABOVE"
# #   },
# #   {
# #     "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
# #     "threshold": "BLOCK_MEDIUM_AND_ABOVE"
# #   },
# #   {
# #     "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
# #     "threshold": "BLOCK_MEDIUM_AND_ABOVE"
# #   },
# # ]

# # model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
# #                               generation_config=generation_config,
# #                               safety_settings=safety_settings)

# # convo = model.start_chat(history=[])
# # def sendrequest(prompt):
# #     convo.send_message(prompt)
# #     return (convo.last.text)


# # wassih=(" Hey Gemini, I'd like you to generate 1 multiple-choice questions (MCQs) in the following format: "
# #                    " Question:(the question)"
# #                    "A:(answer A)"
# #                    "B:(answer B)"
# #                    "C:(answer C) "
# #                    "D:(answer D)"
# #                    "Right answer:(Example A) "
# #         "this is the text: ")
# # # badel_cour=("Hey Gemini, I'd like you to reform the text and make easier to understand:"
# # #            "just return the modeified text this is the text:")
# # # chapitre_text = main.split_text
# # # i=0
# # # while(1):
# # #     print("menu est:"
# # #           "\n1. Generate QCM"
# # #           "\n2. Exit"
# # #           "\n3. Generate Cour")
# # #     choice=input("donner une choix ?")
# # #     if choice=="1":
# # #         convo.send_message(wassih + chapitre_text[i])
# # #         print(convo.last.text)
# # #         i+=1
# # #     elif choice=="2":
# # #         break
# # #     else:
# # #         convo.send_message(badel_cour+chapitre_text[i])
# # #         print(convo.last.text)

# import google.generativeai as genai

# genai.configure(api_key="AIzaSyBqm2z_pcTDCU0ubeEMidJRohRkXDvlIsg")

# # Initialize the generative model
# model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest")

# # Generation configuration
# generation_config = {
#     "temperature": 1,
#     "top_p": 0.95,
#     "top_k": 0,
#     "max_output_tokens": 8192,
# }

# # Safety settings
# safety_settings = [
#     {
#         "category": "HARM_CATEGORY_HARASSMENT",
#         "threshold": "BLOCK_MEDIUM_AND_ABOVE"
#     },
#     {
#         "category": "HARM_CATEGORY_HATE_SPEECH",
#         "threshold": "BLOCK_MEDIUM_AND_ABOVE"
#     },
#     {
#         "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
#         "threshold": "BLOCK_MEDIUM_AND_ABOVE"
#     },
#     {
#         "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
#         "threshold": "BLOCK_MEDIUM_AND_ABOVE"
#     },
# ]

# def send_request(prompt):
#     convo = model.start_chat(history=[])
#     convo.send_message(prompt)
#     return convo.last.text

# def generate_quiz(text):
#     wassih = (" Hey Gemini, I'd like you to generate 1 multiple-choice questions (MCQs) in the following format: "
#               " Question:(the question)"
#               "A:(answer A)"
#               "B:(answer B)"
#               "C:(answer C) "
#               "D:(answer D)"
#               "Right answer:(Example A) "
#               "this is the text: ")
#     return send_request(wassih + text)


import google.generativeai as genai

genai.configure(api_key="AIzaSyBqm2z_pcTDCU0ubeEMidJRohRkXDvlIsg")

# Initialize the generative model
model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest")

# Generation configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 0,
    "max_output_tokens": 8192,
}

# Safety settings
safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
]

def send_request(prompt):
    convo = model.start_chat(history=[])
    convo.send_message(prompt)
    return convo.last.text

# Define wassih globally
wassih = (" Hey Gemini, I'd like you to generate in french 1 multiple-choice questions (MCQs) in the following format: "
          " Question:(the question)"
          "A:(answer A)"
          "B:(answer B)"
          "C:(answer C) "
          "D:(answer D)"
          "Right answer:(Example A) "
          "this is the text: ")
