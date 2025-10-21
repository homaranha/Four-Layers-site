from flask import Flask, render_template, request
import smtplib
from email.message import EmailMessage

app = Flask(__name__)

# Configurações do e-mail
EMAIL_REMETENTE = "seuemail@gmail.com"
SENHA_APP = "sua_senha_de_app"
EMAIL_DESTINO = "clinica@exemplo.com"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/enviar", methods=["POST"])
def enviar():
    nome = request.form["nome"]
    email = request.form["email"]
    mensagem = request.form["mensagem"]

    msg = EmailMessage()
    msg["From"] = EMAIL_REMETENTE
    msg["To"] = EMAIL_DESTINO
    msg["Subject"] = f"Nova mensagem de {nome}"
    msg.set_content(f"Nome: {nome}\nE-mail: {email}\nMensagem:\n{mensagem}")

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL_REMETENTE, SENHA_APP)
            smtp.send_message(msg)
        return "✅ E-mail enviado com sucesso!"
    except Exception as e:
        print("Erro:", e)
        return "❌ Erro ao enviar o e-mail."

if __name__ == "__main__":
    app.run(debug=True)


enviar email 
para segurança um arquivo.env
instala pip install python-dotenv

codigo isso aq


Como gerar a senha de app (passo a passo)

Ative a verificação em duas etapas no Gmail
👉 Vá em https://myaccount.google.com/security

→ “Verificação em duas etapas” → Ativar

Depois que ativar, vá em:
👉 https://myaccount.google.com/apppasswords

Faça login e escolha:

App: selecione “Outro (nome personalizado)”

Nomeie algo tipo: Python Email Script

O Google vai gerar uma senha de 16 caracteres (exemplo):