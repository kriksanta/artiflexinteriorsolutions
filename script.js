const slides=[...document.querySelectorAll('.hero-slide')];
const controls=[...document.querySelectorAll('.slide-control')];
let current=0;
let timer;
function showSlide(index){current=index;slides.forEach((slide,i)=>{const active=i===index;slide.classList.toggle('is-active',active);slide.setAttribute('aria-hidden',String(!active));controls[i].classList.toggle('active',active);controls[i].setAttribute('aria-pressed',String(active));});restartTimer();}
function restartTimer(){clearInterval(timer);timer=setInterval(()=>showSlide((current+1)%slides.length),7000);}
controls.forEach(button=>button.addEventListener('click',()=>showSlide(Number(button.dataset.go))));
if(slides.length)restartTimer();
const overlay=document.querySelector('.menu-overlay');
const menuButton=document.querySelector('.menu-toggle');
function setMenu(open){overlay.classList.toggle('open',open);overlay.setAttribute('aria-hidden',String(!open));menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');menuButton.classList.toggle('is-open',open);document.body.classList.toggle('menu-open',open);if(open)overlay.querySelector('.menu-panel>a').focus();else menuButton.focus();}
menuButton.addEventListener('click',()=>setMenu(!overlay.classList.contains('open')));
overlay.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&overlay.classList.contains('open'))setMenu(false);});
document.querySelector('#year').textContent=new Date().getFullYear();

// Apply locally managed business details, social links, and hero/transformation photos.
if(window.ArtiflexStore){
  const settings=window.ArtiflexStore.getSettings();
  document.querySelectorAll('[data-hero-photo="home"]').forEach(image=>image.src=settings.heroHome);
  document.querySelectorAll('[data-hero-photo="signage"]').forEach(image=>image.src=settings.heroSignage);
  document.querySelectorAll('[data-before-after="before"]').forEach(image=>image.src=settings.beforeImage);
  document.querySelectorAll('[data-before-after="after"]').forEach(image=>image.src=settings.afterImage);
  const socialKeys={Facebook:'facebook',Instagram:'instagram',YouTube:'youtube',WhatsApp:'whatsapp'};
  document.querySelectorAll('.social-links a[aria-label]').forEach(link=>{const key=socialKeys[link.getAttribute('aria-label')];if(key&&settings[key])link.href=settings[key];});
  document.querySelectorAll('[data-contact-address]').forEach(node=>node.textContent=settings.address);
  document.querySelectorAll('[data-contact-phone]').forEach(node=>{node.textContent=settings.phone;node.href='tel:'+settings.phone.replace(/[^+\d]/g,'');});
  document.querySelectorAll('[data-contact-email]').forEach(node=>{node.textContent=settings.email;node.href='mailto:'+settings.email;});
}


// Scale the opening logo directly into the header mark.
const loader=document.querySelector('.intro-loader');
const loaderMark=document.querySelector('.intro-loader-mark');
const headerMark=document.querySelector('.brand');
function finishIntro(){
  if(!loader||!loaderMark||!headerMark)return;
  if(document.documentElement.classList.contains('intro-seen')){loader.remove();return;}
  const start=loaderMark.getBoundingClientRect();
  const target=headerMark.getBoundingClientRect();
  const dx=target.left+target.width/2-(innerWidth/2);
  const dy=target.top+target.height/2-(innerHeight/2);
  const scale=target.width/start.width;
  const end=`translate(-50%,-50%) translate(${dx}px,${dy}px) scale(${scale})`;
  const motion=loaderMark.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:end}],{duration:1250,easing:'cubic-bezier(.72,0,.2,1)',fill:'forwards'});
  motion.onfinish=()=>{try{sessionStorage.setItem('artifex-intro-seen','1');}catch(e){};try{if(!location.hash)history.replaceState(null,'','#top');}catch(e){};loader.classList.add('is-done');setTimeout(()=>loader.remove(),550);};
}
if(document.readyState==='complete')setTimeout(finishIntro,180);else window.addEventListener('load',()=>setTimeout(finishIntro,180),{once:true});


// Imported service-site interactions: material sampler, gallery filters and lightbox,
// before/after comparison, and the WhatsApp quote handoff.
const materialSpecs={
  quartz:{title:'Calacatta quartz countertops',description:'Engineered with 93% crushed quartz. Non-porous, stain-resistant and suited to everyday kitchen use.',best:'Modular kitchens & islands'},
  brass:{title:'Champagne brass aluminium profiles',description:'Satin brushed architectural aluminium profiles selected for a warm metallic accent on cabinetry and doors.',best:'Door handles & cabinet trims'},
  teak:{title:'Smoked teak & natural hardwoods',description:'Kiln-dried hardwood with rich grain, finished with protective sealing for interior use.',best:'Stair treads & wall panelling'},
  steel:{title:'Blackened stainless steel (SS 304)',description:'Structural stainless steel with a matte black powder-coated finish and clean architectural lines.',best:'Staircase frames & railings'},
  glass:{title:'Tempered fluted architectural glass',description:'8 mm toughened reeded glass that diffuses light and adds privacy in a slimline metal frame.',best:'Sliding partitions & wardrobes'},
  acoustic:{title:'Acoustic wood slat wall panels',description:'Natural wood veneer paired with a recycled sound-absorbing PET felt core to help reduce echo.',best:'Feature walls & home theatres'}
};
document.querySelectorAll('.material-sample').forEach(button=>button.addEventListener('click',()=>{
  const spec=materialSpecs[button.dataset.material];if(!spec)return;
  document.querySelectorAll('.material-sample').forEach(sample=>sample.classList.toggle('active',sample===button));
  document.querySelector('#material-title').textContent=spec.title;
  document.querySelector('#material-description').textContent=spec.description;
  document.querySelector('#material-best').textContent=spec.best;
}));

const galleryRoot=document.querySelector('#content-gallery-grid');
const projectDialog=document.querySelector('#project-lightbox');
if(galleryRoot&&window.ArtiflexStore){
  let filteredProjects=window.ArtiflexStore.getPhotos();let activeProject=0;
  const titleEl=document.querySelector('#lightbox-title'),imageEl=document.querySelector('#lightbox-image'),categoryEl=document.querySelector('#lightbox-category'),descriptionEl=document.querySelector('#lightbox-description'),locationEl=document.querySelector('#lightbox-location');
  function showProject(index){if(!filteredProjects.length)return;activeProject=(index+filteredProjects.length)%filteredProjects.length;const item=filteredProjects[activeProject];imageEl.src=item.image;imageEl.alt=item.title;titleEl.textContent=item.title;categoryEl.textContent=item.categoryLabel||item.category;descriptionEl.textContent=item.desc||'Interior and fabrication project by Artifex.';locationEl.textContent=item.location||'Bengaluru';}
  function renderProjects(filter='all'){const all=window.ArtiflexStore.getPhotos();filteredProjects=all.filter(project=>filter==='all'||project.category===filter);galleryRoot.replaceChildren();filteredProjects.forEach((project,index)=>{const card=document.createElement('button');card.type='button';card.className='gallery-project';const image=document.createElement('img');image.src=project.image;image.alt=project.title;image.loading='lazy';image.onerror=()=>{image.src='assets/project-kitchen.jpg';};const heading=document.createElement('h3');heading.textContent=project.title;const meta=document.createElement('p');meta.textContent=(project.categoryLabel||project.category)+' · '+(project.location||'Bengaluru');card.append(image,heading,meta);card.addEventListener('click',()=>{showProject(index);projectDialog.showModal();});galleryRoot.append(card);});if(!filteredProjects.length){const empty=document.createElement('p');empty.className='gallery-intro';empty.textContent='No projects in this category yet.';galleryRoot.append(empty);}}
  renderProjects();
  document.querySelectorAll('.gallery-filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.gallery-filter').forEach(filter=>{const active=filter===button;filter.classList.toggle('active',active);filter.setAttribute('aria-pressed',String(active));});renderProjects(button.dataset.filter);}));
  document.querySelector('#lightbox-close').addEventListener('click',()=>projectDialog.close());
  document.querySelector('#lightbox-prev').addEventListener('click',()=>showProject(activeProject-1));
  document.querySelector('#lightbox-next').addEventListener('click',()=>showProject(activeProject+1));
  projectDialog.addEventListener('click',event=>{if(event.target===projectDialog)projectDialog.close();});
}
const comparison=document.querySelector('#before-after-frame');
comparison?.querySelector('input[type="range"]')?.addEventListener('input',event=>comparison.style.setProperty('--split',event.target.value+'%'));
const quoteForm=document.querySelector('#quote-form');
quoteForm?.addEventListener('submit',event=>{event.preventDefault();const form=new FormData(quoteForm);const message=`Hello Artifex team, my name is ${form.get('name')}. I am interested in ${form.get('service')}. Project details: ${form.get('notes')||'Please contact me to discuss.'} My phone number is ${form.get('phone')}.`;const whatsapp=window.ArtiflexStore?.getSettings().whatsapp||'https://wa.me/917012067527';const separator=whatsapp.includes('?')?'&':'?';const url=whatsapp+separator+'text='+encodeURIComponent(message);window.open(url,'_blank','noopener,noreferrer');document.querySelector('#quote-feedback').textContent='WhatsApp opened with your project brief. Review it there and tap Send when you are ready.';});

document.querySelectorAll('[data-scene-view]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-scene-view]').forEach(item=>item.classList.toggle('active',item===button));window.setArtiflexView?.(button.dataset.sceneView);}));
document.querySelectorAll('[data-scene-material]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-scene-material]').forEach(item=>item.classList.toggle('active',item===button));window.setArtiflexMaterial?.(button.dataset.sceneMaterial);}));
document.querySelectorAll('[data-scene-light]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-scene-light]').forEach(item=>item.classList.toggle('active',item===button));window.setArtiflexLighting?.(button.dataset.sceneLight);}));

