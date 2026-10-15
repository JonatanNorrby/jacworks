/** Add only verified asset-specific attributions here; this is not a blanket license. */
export const assetCredits = [
  {
    title: 'Truffle Man',
    creator: 'dotflare',
    source: 'https://sketchfab.com/3d-models/truffle-man-e41c6781e4854a1fbe5cdf24a0029aab',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    modifications: 'Modified: converted/optimized to GLB, animated for JAC Works.',
    notes: 'Concept: BABAGANOOSH99. The model is currently available in local development only; public builds use a procedural placeholder.',
  },
];

export function createCreditsDialog(trigger: HTMLButtonElement) {
  const dialog = document.createElement('dialog');
  dialog.id = 'credits-panel';
  dialog.setAttribute('aria-labelledby', 'credits-title');
  dialog.innerHTML = `<header><h2 id="credits-title">Credits / Licenses</h2><button type="button" autofocus>Close credits</button></header>
    <div class="credits-scroll" tabindex="0" role="region" aria-label="Third-party asset credits">
      <p>Attributions below apply to the named assets only. External links open in a new tab.</p>
    </div>`;
  const content = dialog.querySelector('.credits-scroll')!;
  function link(label: string, url: string) {
    const anchor = document.createElement('a');
    anchor.textContent = label;
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    return anchor;
  }
  for (const credit of assetCredits) {
    const entry = document.createElement('article');
    const title = document.createElement('h3');
    title.textContent = credit.title;
    const creator = document.createElement('p');
    creator.textContent = `By ${credit.creator}`;
    const links = document.createElement('p');
    links.append(link('Original model (Sketchfab)', credit.source), ' · ', link(credit.license, credit.licenseUrl));
    const modifications = document.createElement('p');
    modifications.textContent = credit.modifications;
    const notes = document.createElement('p');
    notes.textContent = credit.notes;
    entry.append(title, creator, links, modifications, notes);
    content.append(entry);
  }
  document.body.append(dialog);
  dialog.querySelector('button')!.onclick = () => dialog.close();
  // Keep modal keys (including Escape during a room vote) out of game handlers.
  dialog.addEventListener('keydown', event => {
    event.stopPropagation();
    if (event.key !== 'Tab') return;
    const stops = [...dialog.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]')];
    const first = stops[0], last = stops[stops.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  dialog.addEventListener('keyup', event => event.stopPropagation());
  dialog.addEventListener('close', () => trigger.focus());
  trigger.onclick = () => { dialog.showModal(); content.scrollTop = 0; };
  return dialog;
}
