import {CHAT_MAX_LENGTH,cleanChat} from '../../shared/protocol';
import type {ChatMessage,ClientMessage} from '../../shared/protocol';
export function createRoomChat(send:(message:ClientMessage)=>void,stop:()=>void){
 const root=document.createElement('section');root.id='room-chat';root.setAttribute('aria-label','Room chat');
 const log=document.createElement('div');log.id='chat-log';log.setAttribute('role','log');
 const hint=document.createElement('small');hint.textContent='Enter to chat';
 const input=document.createElement('input');input.id='chat-input';input.setAttribute('aria-label','Room chat message');input.maxLength=CHAT_MAX_LENGTH;input.placeholder='Room message | Enter sends | Esc cancels';input.hidden=true;
 root.append(log,hint,input);document.body.append(root);let open=false;
 function close(){open=false;input.value='';input.hidden=true;root.classList.remove('open');input.blur();stop()}
 input.addEventListener('blur',()=>{if(open)close()});
 return {isOpen:()=>open,keydown(event:KeyboardEvent){
  if(open){event.stopImmediatePropagation();if(event.key==='Escape'){event.preventDefault();close()}else if(event.key==='Enter'&&!event.isComposing){event.preventDefault();if(!event.repeat){const text=cleanChat(input.value);if(text)send({type:'chat',text});close()}}return true}
  if(event.key!=='Enter'||event.repeat||event.isComposing||event.target instanceof HTMLButtonElement||event.target instanceof HTMLAnchorElement||event.target instanceof HTMLInputElement||event.target instanceof HTMLTextAreaElement||event.target instanceof HTMLSelectElement||(event.target instanceof HTMLElement&&event.target.isContentEditable))return false;
  event.preventDefault();event.stopImmediatePropagation();open=true;stop();root.classList.add('open');input.hidden=false;input.focus();log.scrollTop=log.scrollHeight;return true;
 },receive(message:ChatMessage){const row=document.createElement('div');row.className='chat-row';if(message.senderId===null)row.classList.add('system');const name=document.createElement('strong');name.textContent=message.name+': ';row.append(name,document.createTextNode(message.text));log.append(row);while(log.childElementCount>60)log.firstElementChild!.remove();log.scrollTop=log.scrollHeight;setTimeout(()=>row.classList.add('old'),10000)}};
}
