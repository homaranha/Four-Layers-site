/* ================================
   Funções auxiliares do DOM
   ================================ */
// Simplificam o uso de querySelector e querySelectorAll
const qs = s => document.querySelector(s)                     // Retorna o primeiro elemento que combina com o seletor
const qsa = s => Array.from(document.querySelectorAll(s))     // Retorna todos os elementos que combinam com o seletor em um array
  

/* ================================
   Menu Mobile (abrir/fechar)
   ================================ */
const mobileToggle = qs('#mobileToggle')   // Botão que abre/fecha o menu mobile
const mobileMenu = qs('#mobileMenu')       // Container do menu mobile

mobileToggle?.addEventListener('click', () => {
  const expanded = mobileToggle.getAttribute('aria-expanded') === 'true' // Verifica se já está aberto
  mobileToggle.setAttribute('aria-expanded', String(!expanded))          // Alterna atributo de acessibilidade
  // Alterna visibilidade do menu
  if (mobileMenu.classList.contains('hidden')) mobileMenu.classList.remove('hidden')
  else mobileMenu.classList.add('hidden')
})


/* ================================
   Scroll Spy (destacar item ativo no menu)
   ================================ */
const navLinks = qsa('.nav-link')  // Todos os links do menu
const sections = navLinks
  .map(link => document.getElementById(link.getAttribute('href').replace('#',''))) // Liga cada link à seção correspondente
  .filter(Boolean) // Remove links inválidos

function onScrollSpy(){
  const offset = window.scrollY + window.innerHeight * 0.35 // Define área de ativação (um pouco abaixo do topo)
  sections.forEach(sec => {
    const id = sec.id
    const link = document.querySelector(`.nav-link[href="#${id}"]`)
    if(!link) return
    const top = sec.offsetTop
    const bottom = top + sec.offsetHeight
    // Adiciona classe "active" se a seção estiver visível
    if (offset >= top && offset < bottom) link.classList.add('active')
    else link.classList.remove('active')
  })
}
window.addEventListener('scroll', onScrollSpy, {passive:true})
window.addEventListener('resize', onScrollSpy)
onScrollSpy() // Executa uma vez ao carregar


/* ================================
   Rolagem suave entre seções
   ================================ */
qsa('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href = a.getAttribute('href')
    if(!href || !href.startsWith('#')) return // Ignora links externos
    const target = document.querySelector(href)
    if(target){
      e.preventDefault() // Evita salto instantâneo
      target.scrollIntoView({behavior:'smooth', block:'start'}) // Rolagem suave
      // Fecha menu mobile se estiver aberto
      if(!mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden')
    }
  })
})


/* ================================
   Modal de Contato (Agendar)
   ================================ */
const modalBackdrop = qs('#modalBackdrop')     // Fundo escuro do modal
const btnContact = qs('#btn-contact')          // Botão principal de abrir modal
const btnOpenContact = qs('#btn-open-contact') // Outro botão que também abre modal
const modalCancel = qs('#modalCancel')         // Botão de cancelar
const modalForm = qs('#modalForm')             // Formulário dentro do modal
const modalFeedback = qs('#modalFeedback')     // Mensagem de status (feedback)
const numwhats = "5541998436600"               // Número de envio do Whatsapp

function openModal(){
  modalBackdrop.style.display = 'flex'           // Exibe modal
  modalBackdrop.setAttribute('aria-hidden','false')
  const first = modalBackdrop.querySelector('input,select,textarea,button')
  first?.focus() // Foca no primeiro campo para acessibilidade
}

function closeModal(){
  modalBackdrop.style.display = 'none'           // Esconde modal
  modalBackdrop.setAttribute('aria-hidden','true')
  modalFeedback.textContent = ''                 // Limpa mensagens
}

// Eventos para abrir e fechar o modal
btnContact?.addEventListener('click', openModal)
btnOpenContact?.addEventListener('click', openModal)
modalCancel?.addEventListener('click', closeModal)
modalBackdrop?.addEventListener('click', (e)=>{
  if(e.target === modalBackdrop) closeModal() // Fecha ao clicar fora do conteúdo
})

// Envio do formulário dentro do modal
modalForm?.addEventListener('submit', (e)=>{
  e.preventDefault()
  const name = qs('#mname').value.trim()
  const phone = qs('#mphone').value.trim()
  const treatment = qs('#mtreatment').value

  // Validação básica
  if(!name || !phone || !treatment){ 
    modalFeedback.textContent = 'Preencha todos os campos.'; 
    return 
  }

  const mensagemwhats = `Olá! Meu nome é ${name}, vim pelo site e gostaria de saber mais sobre o tratamento de ${treatment}.`
  const url = `https://wa.me/${numwhats}?text=${encodeURIComponent(mensagemwhats)}`

  modalFeedback.textContent = 'Solicitação enviada com sucesso! Entraremos em contato.'
  
  window.open(url, "_blank")

  // Simula envio (poderia ser um fetch real)
  setTimeout(()=>closeModal(), 2000)
})


/* ================================
   Formulário principal da página
   ================================ */
const contactForm = qs('#contactForm')
contactForm?.addEventListener('submit', (e)=>{
  e.preventDefault()
  const name = qs('#name').value.trim()
  const phone = qs('#phone').value.trim()
  const email = qs('#email').value.trim()
  const message = qs('#message').value.trim()
  const feedback = qs('#formFeedback')

  // Verifica se todos os campos estão preenchidos
  if(!name || !phone || !email || !message){ 
    feedback.textContent = 'Por favor, preencha todos os campos.'; 
    return 
  }

  // Validação simples de e-mail
  if(!/^\S+@\S+\.\S+$/.test(email)){ 
    feedback.textContent = 'E-mail inválido.'; 
    return 
  }

  feedback.textContent = 'Mensagem enviada com sucesso! A equipe entrará em contato.'
  contactForm.reset() // Limpa formulário
  setTimeout(()=>feedback.textContent = '', 4000) // Remove mensagem após 4s
})


/* ================================
   Máscara de telefone (formato BR)
   ================================ */
function maskPhone(input){
  input.addEventListener('input', ()=>{
    let v = input.value.replace(/\D/g,'') // Remove caracteres não numéricos
    if (v.length > 11) v = v.slice(0,11)
    if (v.length <= 2) input.value = v
    else if (v.length <= 6) input.value = `(${v.slice(0,2)}) ${v.slice(2)}`
    else if (v.length <= 10) input.value = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`
    else input.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`
  })
}
const phoneInputs = [qs('#phone'), qs('#mphone')]
phoneInputs.forEach(i => i && maskPhone(i)) // Aplica máscara nos dois campos


/* ================================
   Abrir localização (Google Maps)
   ================================ */
qs('#openMap')?.addEventListener('click', ()=> {
  const url = 'https://www.google.com/maps/place/Four+Layers+Odontologia/@-25.4746948,-49.2977325,17z/data=!3m2!4b1!5s0x94d2434a9c503b81:0xb0d4dd147313d613!4m6!3m5!1s0x94dce302e5dd34c7:0xca794c0c619f7d71!8m2!3d-25.4746997!4d-49.2951576!16s%2Fg%2F11shc5s8yx?entry=ttu&g_ep=EgoyMDI1MTAxOS4wIKXMDSoASAFQAw%3D%3D'
  window.open(url,'_blank') // Abre o mapa em nova aba
})
qs('#btn-location')?.addEventListener('click', ()=>qs('#openMap').click()) // Outro botão chama o mesmo evento


/* ================================
   Botões "Saiba mais" dos tratamentos
   ================================ */
qsa('button[data-open="treatment"]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const title = btn.getAttribute('data-title') || 'Tratamento'
    // Em um site real, aqui poderia puxar informações de uma API
    alert(`${title} — Para mais informações, entre em contato conosco.`)
  })
})


/* ================================
   Acessibilidade: tecla ESC fecha menus/modais
   ================================ */
window.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    if(modalBackdrop.style.display === 'flex') closeModal()
    if(!mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden')
  }
})


/* ================================
   Animação suave das seções (fade-in)
   ================================ */
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.style.opacity = 1 // Mostra a seção
  })
}, {threshold: 0.12}) // Ativa quando 12% da seção aparece na tela

qsa('section').forEach(s=>{
  s.style.opacity = 0                         // Começa invisível
  s.style.transition = 'opacity .7s ease'     // Transição suave
  observer.observe(s)                         // Observa quando entra no viewport
})
