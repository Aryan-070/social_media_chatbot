from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
llm = ChatGroq(
    model_name="llama-3.3-70b-versatile",
    temperature=0,
    groq_api_key="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"
    # other params...
)




prompt_post = PromptTemplate.from_template(
    """
    ### POST CONTENT CREATION:
    
{topic}

### INSTRUCTION:
You are Social Media expert at AIQWIP. 

Your task is to create a professional and engaging social media post on the topic or based on the content from the provided URL. The post should highlight the topic. The content should be insightful, informative, and drive engagement from potential clients. Additionally, include a call-to-action inviting further inquiries.

Make sure to keep the tone engaging and professional while aligning with the expertise and industry AIQWIP operates in.
For contact information pls mail us on recruitment@aiqwip.com or visit our website: https://www.aiqwip.com
### POST CONTENT (NO PREAMBLE):
    """
)
chain_post = prompt_post | llm

def post_template(topic):
    print(topic)
    res = chain_post.invoke({"topic": topic})
    return res.content

