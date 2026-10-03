(function(){
  const login=document.querySelector('#admin-login');
  const dashboard=document.querySelector('#admin-dashboard');
  const loginForm=document.querySelector('#admin-login-form');
  const loginMessage=document.querySelector('#admin-login-message');
  if(!login||!dashboard||!window.ArtiflexStore)return;
  const AUTH_KEY='artifex_admin_logged_in';
  function showDashboard(){login.hidden=true;dashboard.hidden=false;loadSettings();renderProjects();}
  if(sessionStorage.getItem(AUTH_KEY)==='1')showDashboard();
  loginForm.addEventListener('submit',event=>{
    event.preventDefault();const values=new FormData(loginForm);
    if(values.get('username')==='adersh'&&values.get('password')==='Qwerty@123'){
      sessionStorage.setItem(AUTH_KEY,'1');loginMessage.textContent='';showDashboard();
    }else{loginMessage.textContent='Username or password is incorrect.';loginMessage.className='admin-message is-error';}
  });
  document.querySelector('#admin-logout')?.addEventListener('click',()=>{sessionStorage.removeItem(AUTH_KEY);dashboard.hidden=true;login.hidden=false;loginForm.reset();});

  const settingsForm=document.querySelector('#site-settings-form');
  const settingsMessage=document.querySelector('#settings-message');
  function loadSettings(){const settings=window.ArtiflexStore.getSettings();Object.entries(settings).forEach(([key,value])=>{const field=settingsForm.elements.namedItem(key);if(field)field.value=value;});}
  function optimizeImage(file,maxSide=1800){
    return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(new Error('Could not read image'));reader.onload=()=>{const image=new Image();image.onerror=()=>reject(new Error('Invalid image'));image.onload=()=>{const scale=Math.min(1,maxSide/Math.max(image.width,image.height));const canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.82));};image.src=reader.result;};reader.readAsDataURL(file);});
  }
  async function valueFor(form,key){const upload=form.elements.namedItem(key+'File');if(upload?.files?.[0])return optimizeImage(upload.files[0]);const field=form.elements.namedItem(key);return field?.value?.trim()||undefined;}
  settingsForm.addEventListener('submit',async event=>{
    event.preventDefault();settingsMessage.textContent='Saving…';
    try{const update={};for(const key of ['heroHome','heroSignage','beforeImage','afterImage','facebook','instagram','youtube','whatsapp','phone','address','email']){const value=await valueFor(settingsForm,key);if(value!==undefined)update[key]=value;}
      if(!window.ArtiflexStore.saveSettings(update))throw new Error('Storage is full. Try smaller photos.');
      settingsMessage.textContent='Website settings saved in this browser. Refresh the website pages to see the changes.';settingsMessage.className='admin-message';
    }catch(error){settingsMessage.textContent=error.message||'Could not save. Try smaller photos.';settingsMessage.className='admin-message is-error';}
  });
  document.querySelector('#settings-reset')?.addEventListener('click',()=>{window.ArtiflexStore.saveSettings(window.ArtiflexStore.getDefaultSettings());settingsForm.reset();loadSettings();settingsMessage.textContent='Default photos and contact links restored.';});

  const form=document.querySelector('#admin-project-form');
  const list=document.querySelector('#admin-project-list');
  const message=document.querySelector('#admin-message');
  function renderProjects(){
    list.replaceChildren();window.ArtiflexStore.getPhotos().forEach(project=>{
      const row=document.createElement('div');row.className='admin-project-row';const image=document.createElement('img');image.src=project.image;image.alt='';image.onerror=()=>{image.src='assets/project-kitchen.jpg';};
      const meta=document.createElement('div');const title=document.createElement('h3');title.textContent=project.title;const detail=document.createElement('p');detail.textContent=(project.categoryLabel||project.category)+' · '+(project.location||'Bengaluru');meta.append(title,detail);
      const remove=document.createElement('button');remove.type='button';remove.className='admin-delete';remove.textContent='Delete';remove.addEventListener('click',()=>{window.ArtiflexStore.deletePhoto(project.id);renderProjects();message.textContent='Project deleted from this browser’s gallery.';});row.append(image,meta,remove);list.append(row);
    });
    if(!list.children.length){const empty=document.createElement('p');empty.textContent='No gallery photos yet. Add a project to get started.';list.append(empty);}
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();const data=new FormData(form);const file=data.get('imageFile');const url=String(data.get('imageUrl')||'').trim();
    try{const image=file&&file.size?await optimizeImage(file,1600):url;if(!image){message.textContent='Choose an image file or provide an image URL.';return;}
      window.ArtiflexStore.addPhoto({title:String(data.get('title')).trim(),category:String(data.get('category')),image,location:String(data.get('location')||'').trim(),desc:String(data.get('description')||'').trim()});message.textContent='Project added to this browser’s gallery.';message.className='admin-message';form.reset();renderProjects();
    }catch(error){message.textContent='Could not save this image. Try a smaller image file.';message.className='admin-message is-error';}
  });
  document.querySelector('#admin-reset')?.addEventListener('click',()=>{window.ArtiflexStore.resetPhotos();message.textContent='Default gallery restored in this browser.';renderProjects();});
})();
