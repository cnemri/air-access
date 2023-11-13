from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import json
import re
from time import sleep


from dotenv import load_dotenv
from openai import OpenAI


app = Flask(__name__)
CORS(app)

load_dotenv()
client = OpenAI()

def remove_html_tags(text):
    # Define the HTML tag pattern
    html_tag_pattern = re.compile(r'<.*?>')
    
    # Replace HTML tags with an empty string
    cleaned_text = re.sub(html_tag_pattern, '', text)

    return cleaned_text



@app.route('/api/scrape', methods=['POST'])
def scrape_property():
    url = request.json.get('property_url')

    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)

    # while True:
    try:
        driver.get(url)
        wait = WebDriverWait(driver, 5)

        button_element = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR,".l1ovpqvx.b1p20n7u.c1n3e6jn")))
        driver.execute_script("arguments[0].click();", button_element)

        # images = wait.until(EC.presence_of_all_elements_located((By.TAG_NAME, "img")))
        sleep(10)
        images = driver.find_elements(By.TAG_NAME, "img")
        images = [image for image in images if image.find_element(By.XPATH,"..").tag_name == "picture"] 
        image_urls = [image.get_attribute("src") for image in images]

        description_element = driver.find_elements(By.CSS_SELECTOR, ".ll4r2nl.dir.dir-ltr")
        description = description_element[1].get_attribute("innerHTML")

        return jsonify({'image_urls': image_urls, 'description':remove_html_tags(description)})
    except Exception as e:
        print(e)
        # print("Retrying...")
        return jsonify({'error': 'Unable to scrape property'}), 400
    finally:
        driver.quit()

@app.route('/api/analyze-images', methods=['POST'])
def analyze_images():
    image_urls = request.json.get('image_urls')
    
    if not image_urls:
        return jsonify({'error': 'No image URLs provided'}), 400

    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Please identify anything within these images that is against wheelchair accessibility standards. Kindly provide specific answer and no general guidelines. Your output should be in JSON format. With a field accessible (true, false or unsure) and accessibility issues should be a list of nested fields image url (kindly provide the original image url) and a list of issues nested field: severity (high medium low) and description. Image urls are: {image_urls}"
                }
            ]
        }
    ]

    # Add image URLs to the messages
    for image_url in image_urls:
        messages[0]["content"].append(
            {
                "type": "image_url",
                "image_url": {
                    "url": image_url
                }
            }
        )

    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=messages,
        max_tokens=800
    )

    raw_image_analysis = response.choices[0].message.content

    start = raw_image_analysis.find('{')
    end = raw_image_analysis.rfind('}') + 1
    structured_image_analysis = json.loads(raw_image_analysis[start:end])

    return jsonify(structured_image_analysis)

@app.route('/api/accessibility-analysis', methods=['POST'])
def accessibility_analysis():
    data = request.json
    description = data.get('description')
    image_analysis = data.get('image_analysis')

    if not description or not image_analysis:
        return jsonify({'error': 'Description and image analysis required'}), 400

    completion = client.chat.completions.create(
        model="gpt-4-1106-preview",
        messages=[
            {"role": "system", "content": "You will be advising a wheelchair user on whether an Airbnb property is accessible to them based on listing description and AI-powered image analysis."},
            {"role": "user", "content": f"Based on the following description: {description} and image analysis: {image_analysis}, is this property accessible to a wheelchair user? Answer should be a json with the following fields: 1. overall (yes, no, unsure) field 2. pros and 3. cons fields containing a list of positive and bad accessibility features. a final 4. email field should contain a draft of an email that the user could send to the host about potential issues"},
        ],
        response_format={'type':'json_object'}
    )

    raw_final_answer = completion.choices[0].message.content
    start = raw_final_answer.find('{')
    end = raw_final_answer.rfind('}') + 1
    structured_final_answer = json.loads(raw_final_answer[start:end])

    return jsonify(structured_final_answer)


if __name__ == '__main__':
    app.run()
