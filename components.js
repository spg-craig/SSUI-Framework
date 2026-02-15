// SSUI framework behaviors
(function(){
  function showTab(name, btn){
    document.querySelectorAll('.ss-tab-panel').forEach(p=>{
      p.classList.remove('active');
      p.setAttribute('hidden','hidden');
    });
    document.querySelectorAll('.ss-tab-bar button').forEach(b=>{
      b.classList.remove('active');
      b.setAttribute('aria-selected','false');
      b.setAttribute('tabindex','-1');
    });
    const panel = document.getElementById('ss-tab-'+name);
    if(panel){
      panel.classList.add('active');
      panel.removeAttribute('hidden');
    }
    const activeBtn = btn || document.querySelector(`.ss-tab-bar [data-ss-tab="${name}"]`);
    if(activeBtn){
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-selected','true');
      activeBtn.setAttribute('tabindex','0');
    }
  }

  function showFlow(type){
    document.querySelectorAll('.ss-flow').forEach(f=>{
      f.classList.remove('visible');
      f.setAttribute('hidden','hidden');
    });
    const flow = document.getElementById('ss-flow-'+type);
    if(flow){
      flow.classList.add('visible');
      flow.removeAttribute('hidden');
    }
    const btnHs=document.getElementById('ss-btn-hs');
    const btnCw=document.getElementById('ss-btn-cw');
    if(btnHs){
      btnHs.className=type==='hs'?'active-hs':'';
      btnHs.setAttribute('aria-pressed', type === 'hs' ? 'true' : 'false');
    }
    if(btnCw){
      btnCw.className=type==='cw'?'active-cw':'';
      btnCw.setAttribute('aria-pressed', type === 'cw' ? 'true' : 'false');
    }
  }

  // Event delegation
  const openModalWithAnim = (modal)=>{
    if(!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
  };

  const closeModalWithAnim = (modal)=>{
    if(!modal) return;
    if(modal.getAttribute('data-ss-confirm-modal') === 'true'){
      settleConfirm(modal, false);
    }
    modal.classList.add('is-closing');
    setTimeout(()=>{
      modal.classList.remove('is-open','is-closing');
      modal.setAttribute('aria-hidden','true');
      if(modal.getAttribute('data-ss-dynamic') === 'true'){
        modal.remove();
      }
    }, 220);
  };

  const ensureToastViewport = ()=>{
    let viewport = document.querySelector('.ss-toast-viewport[data-ss-global="true"]');
    if(viewport) return viewport;
    viewport = document.createElement('div');
    viewport.className = 'ss-toast-viewport';
    viewport.setAttribute('data-ss-global', 'true');
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', 'Notifications');
    viewport.setAttribute('aria-live', 'polite');
    viewport.setAttribute('aria-atomic', 'false');
    const host = document.querySelector('.ss-ui') || document.body;
    host.appendChild(viewport);
    return viewport;
  };

  const getToastA11y = (type, livePreference)=>{
    const live = livePreference || (type === 'error' || type === 'warn' ? 'assertive' : 'polite');
    const role = live === 'assertive' ? 'alert' : 'status';
    return {live, role};
  };

  const confirmState = new WeakMap();
  const settleConfirm = (modal, value)=>{
    if(!modal) return;
    const state = confirmState.get(modal);
    if(state && !state.settled){
      state.settled = true;
      try{ state.resolve(!!value); }catch{}
      confirmState.delete(modal);
    }
  };

  const dismissToastWithAnim = (toast)=>{
    if(!toast) return;
    toast.classList.add('is-leaving');
    setTimeout(()=>toast.remove(), 210);
  };

  const getSortAriaValue = (th)=>{
    if(th.classList.contains('is-asc')) return 'ascending';
    if(th.classList.contains('is-desc')) return 'descending';
    return 'none';
  };

  const updateTableSortA11y = (table, activeTh)=>{
    table.querySelectorAll('th[data-ss-sort]').forEach(th=>{
      th.setAttribute('aria-sort', th === activeTh ? getSortAriaValue(th) : 'none');
    });
  };

  const initA11yScaffolding = ()=>{
    document.querySelectorAll('.ss-tab-bar').forEach((bar, idx)=>{
      bar.setAttribute('role','tablist');
      bar.querySelectorAll('[data-ss-tab]').forEach((tabBtn)=>{
        const name = tabBtn.getAttribute('data-ss-tab');
        if(!name) return;
        const panel = document.getElementById('ss-tab-' + name);
        const tabId = tabBtn.id || `ss-tab-btn-${idx}-${name}`;
        tabBtn.id = tabId;
        tabBtn.setAttribute('role','tab');
        tabBtn.setAttribute('aria-controls','ss-tab-' + name);
        if(panel){
          panel.setAttribute('role','tabpanel');
          panel.setAttribute('aria-labelledby',tabId);
        }
      });
      const activeTab = bar.querySelector('[data-ss-tab].active') || bar.querySelector('[data-ss-tab]');
      if(activeTab){
        showTab(activeTab.getAttribute('data-ss-tab'), activeTab);
      }
    });

    document.querySelectorAll('th[data-ss-sort]').forEach(th=>{
      th.setAttribute('tabindex','0');
      th.setAttribute('role','button');
      th.setAttribute('aria-sort', getSortAriaValue(th));
      const label = (th.textContent || 'column').trim();
      th.setAttribute('aria-label', `Sort by ${label}`);
    });

    document.querySelectorAll('tr[data-ss-row]').forEach((row)=>{
      row.setAttribute('tabindex','0');
      row.setAttribute('role','button');
      if(!row.getAttribute('aria-label')){
        const firstCellText = (row.querySelector('td')?.textContent || 'row action').trim();
        row.setAttribute('aria-label', `Open row for ${firstCellText}`);
      }
    });

    document.querySelectorAll('[data-ss-flow]').forEach((btn)=>{
      btn.setAttribute('aria-pressed', btn.classList.contains('active-hs') || btn.classList.contains('active-cw') ? 'true' : 'false');
    });

    document.querySelectorAll('.ss-flow').forEach((flow)=>{
      if(flow.classList.contains('visible')) flow.removeAttribute('hidden');
      else flow.setAttribute('hidden','hidden');
    });

    document.querySelectorAll('[data-ss-required]').forEach(field=>{
      field.setAttribute('aria-required','true');
    });
  };

  const updateTransferUi = (wrap)=>{
    if(!wrap) return;
    const from = wrap.querySelector('[data-ss-transfer-source]');
    const to = wrap.querySelector('[data-ss-transfer-selected]');
    if(!from || !to) return;
    const countEl = wrap.querySelector('[data-ss-transfer-count]');
    if(countEl) countEl.textContent = `${to.options.length} selected`;
    const hasFrom = from.options.length > 0;
    const hasTo = to.options.length > 0;
    wrap.querySelectorAll('[data-ss-transfer-action="add"],[data-ss-transfer-action="add-all"]').forEach(btn=>{
      if(btn.matches('[data-ss-transfer-action="add"]')) btn.disabled = !Array.from(from.options).some(o=>o.selected);
      if(btn.matches('[data-ss-transfer-action="add-all"]')) btn.disabled = !hasFrom;
    });
    wrap.querySelectorAll('[data-ss-transfer-action="remove"],[data-ss-transfer-action="remove-all"]').forEach(btn=>{
      if(btn.matches('[data-ss-transfer-action="remove"]')) btn.disabled = !Array.from(to.options).some(o=>o.selected);
      if(btn.matches('[data-ss-transfer-action="remove-all"]')) btn.disabled = !hasTo;
    });
  };

  const moveTransferOptions = (from, to, mode)=>{
    if(!from || !to) return;
    const options = Array.from(from.options);
    const toMove = mode === 'all' ? options : options.filter(o=>o.selected);
    toMove.forEach(opt=>{
      opt.selected = false;
      to.appendChild(opt);
    });
  };

  const applyTransferFilter = (selectEl, query)=>{
    if(!selectEl) return;
    const q = (query || '').trim().toLowerCase();
    Array.from(selectEl.options).forEach(opt=>{
      const haystack = `${opt.textContent || ''} ${opt.value || ''}`.toLowerCase();
      opt.hidden = q ? !haystack.includes(q) : false;
      if(opt.hidden) opt.selected = false;
    });
  };

  const updateTransferFilters = (wrap)=>{
    if(!wrap) return;
    const source = wrap.querySelector('[data-ss-transfer-source]');
    const selected = wrap.querySelector('[data-ss-transfer-selected]');
    const sourceFilter = wrap.querySelector('[data-ss-transfer-filter="source"]');
    const selectedFilter = wrap.querySelector('[data-ss-transfer-filter="selected"]');
    applyTransferFilter(source, sourceFilter?.value || '');
    applyTransferFilter(selected, selectedFilter?.value || '');
  };

  const handleTransferAction = (button)=>{
    const wrap = button.closest('[data-ss-transfer]');
    if(!wrap) return;
    const source = wrap.querySelector('[data-ss-transfer-source]');
    const selected = wrap.querySelector('[data-ss-transfer-selected]');
    if(!source || !selected) return;
    const action = button.getAttribute('data-ss-transfer-action');
    if(action === 'add') moveTransferOptions(source, selected, 'selected');
    if(action === 'add-all') moveTransferOptions(source, selected, 'all');
    if(action === 'remove') moveTransferOptions(selected, source, 'selected');
    if(action === 'remove-all') moveTransferOptions(selected, source, 'all');
    updateTransferFilters(wrap);
    updateTransferUi(wrap);
    validateField(selected);
  };

  const initTransferLists = ()=>{
    document.querySelectorAll('[data-ss-transfer]').forEach((wrap)=>{
      const source = wrap.querySelector('[data-ss-transfer-source]');
      const selected = wrap.querySelector('[data-ss-transfer-selected]');
      if(!source || !selected) return;
      source.setAttribute('aria-label', source.getAttribute('aria-label') || 'Available items');
      selected.setAttribute('aria-label', selected.getAttribute('aria-label') || 'Selected items');
      updateTransferFilters(wrap);
      updateTransferUi(wrap);
    });
  };

  const openDrawer = (id)=>{
    const drawer = document.getElementById(id);
    if(!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden','false');
  };

  const closeDrawer = (drawer)=>{
    if(!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden','true');
  };

  const togglePopover = (id, trigger)=>{
    const pop = document.getElementById(id);
    if(!pop) return;
    const next = !pop.classList.contains('is-open');
    document.querySelectorAll('.ss-popover.is-open').forEach(p=>p.classList.remove('is-open'));
    if(next){
      pop.classList.add('is-open');
      if(trigger) trigger.setAttribute('aria-expanded','true');
    }else if(trigger){
      trigger.setAttribute('aria-expanded','false');
    }
  };

  const initCombobox = (wrap)=>{
    const input = wrap.querySelector('[data-ss-combobox-input]');
    const list = wrap.querySelector('[data-ss-combobox-list]');
    const tags = wrap.querySelector('[data-ss-combobox-tags]');
    const hiddenWrap = wrap.querySelector('[data-ss-combobox-hidden]');
    if(!input || !list || !tags || !hiddenWrap) return;
    const raw = wrap.getAttribute('data-ss-combobox-options') || '';
    const items = raw.split(',').map(s=>s.trim()).filter(Boolean);
    const name = wrap.getAttribute('data-ss-combobox-name') || 'tags';

    const selectedValues = new Set();

    const syncHidden = ()=>{
      hiddenWrap.innerHTML = '';
      Array.from(selectedValues).forEach(value=>{
        const el = document.createElement('input');
        el.type = 'hidden';
        el.name = name;
        el.value = value;
        hiddenWrap.appendChild(el);
      });
    };

    const renderTags = ()=>{
      tags.innerHTML = '';
      Array.from(selectedValues).forEach(value=>{
        const chip = document.createElement('span');
        chip.className = 'ss-tag-chip';
        chip.innerHTML = `<span>${value}</span><button type="button" aria-label="Remove ${value}" data-ss-tag-remove="${value}">×</button>`;
        tags.appendChild(chip);
      });
      syncHidden();
    };

    const renderOptions = ()=>{
      const q = input.value.trim().toLowerCase();
      const options = items.filter(item=>!selectedValues.has(item)).filter(item=>!q || item.toLowerCase().includes(q));
      list.innerHTML = '';
      if(!options.length){
        const empty = document.createElement('div');
        empty.className = 'ss-combobox-empty';
        empty.textContent = q ? 'No matches. Press Enter to create.' : 'No options available.';
        list.appendChild(empty);
        return;
      }
      options.forEach(option=>{
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ss-combobox-option';
        btn.setAttribute('data-ss-combobox-option', option);
        btn.textContent = option;
        list.appendChild(btn);
      });
    };

    const addValue = (value)=>{
      const v = (value || '').trim();
      if(!v || selectedValues.has(v)) return;
      selectedValues.add(v);
      if(!items.includes(v)) items.push(v);
      input.value = '';
      renderTags();
      renderOptions();
    };

    wrap.__ssCombobox = {addValue, selectedValues, renderOptions, renderTags};
    renderTags();
    renderOptions();
  };

  const initAllComboboxes = ()=>{
    document.querySelectorAll('[data-ss-combobox]').forEach(initCombobox);
  };

  const dataTableState = new WeakMap();
  const isTruthyAttr = (value)=>['1','true','yes','on'].includes(String(value || '').trim().toLowerCase());
  const isFalsyAttr = (value)=>['0','false','no','off'].includes(String(value || '').trim().toLowerCase());
  const getDataTableParams = (state)=>({
    page: state.page,
    pageSize: state.pageSize,
    query: state.query || '',
    sortIndex: state.sortIndex,
    sortDir: state.sortDir,
    sortType: state.sortType
  });

  const setDataTableLoading = (wrap, loading)=>{
    const table = wrap?.querySelector('table');
    if(table) table.setAttribute('aria-busy', loading ? 'true' : 'false');
    wrap?.querySelectorAll('[data-ss-page-prev],[data-ss-page-next],[data-ss-page-size],[data-ss-data-table-search]').forEach(el=>{
      if(el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLButtonElement){
        el.disabled = !!loading;
      }
    });
  };

  const normalizeServerRowsToHtml = (rows)=>{
    if(typeof rows === 'string') return rows;
    if(Array.isArray(rows)){
      return rows.map(row=>{
        if(typeof row === 'string') return row;
        if(row && typeof row === 'object'){
          if(typeof row.html === 'string') return row.html;
          if(Array.isArray(row.cells)){
            const attrs = row.rowId ? ` data-ss-row-id="${String(row.rowId)}"` : '';
            const cells = row.cells.map(c=>`<td>${String(c ?? '')}</td>`).join('');
            return `<tr${attrs}>${cells}</tr>`;
          }
        }
        return '';
      }).join('');
    }
    return '';
  };

  const applyServerRows = (wrap, rows)=>{
    const tbody = wrap?.querySelector('table tbody');
    if(!tbody) return;
    const html = normalizeServerRowsToHtml(rows);
    tbody.innerHTML = html;
  };

  const loadDataTableServerPage = async (wrap)=>{
    const state = dataTableState.get(wrap);
    if(!state || state.mode !== 'server') return;
    const provider = state.serverProvider || window.SSUI?.dataTableServerProvider;
    if(typeof provider !== 'function') return;
    state.requestSeq += 1;
    const requestId = state.requestSeq;
    setDataTableLoading(wrap, true);
    try{
      const result = await provider({wrap, ...getDataTableParams(state)});
      if(requestId !== state.requestSeq) return;
      const total = Number(result?.total ?? result?.totalRows ?? result?.meta?.total);
      if(Number.isFinite(total) && total >= 0){
        state.totalRows = total;
      }
      applyServerRows(wrap, result?.rows ?? result?.rowsHtml ?? result?.html ?? '');
    }catch(err){
      if(window.SSUI && typeof window.SSUI.onDataTableError === 'function'){
        window.SSUI.onDataTableError({wrap, error: err, ...getDataTableParams(state)});
      }
    }finally{
      if(requestId === state.requestSeq){
        setDataTableLoading(wrap, false);
      }
      renderDataTable(wrap);
    }
  };

  const refreshDataTable = (wrap)=>{
    const state = dataTableState.get(wrap);
    if(!state) return;
    if(state.mode === 'server'){
      loadDataTableServerPage(wrap);
    }else{
      renderDataTable(wrap);
    }
  };

  const updateDataTableBulkUi = (wrap)=>{
    const table = wrap?.querySelector('table');
    if(!table) return;
    const rowChecks = Array.from(table.querySelectorAll('[data-ss-row-select]'));
    const selected = rowChecks.filter(cb=>cb.checked);
    const selectedCount = selected.length;
    const countEl = wrap.querySelector('[data-ss-bulk-count]');
    const applyBtn = wrap.querySelector('[data-ss-bulk-apply]');
    const actionEl = wrap.querySelector('[data-ss-bulk-action]');
    const selectAll = table.querySelector('[data-ss-select-all]');
    if(countEl) countEl.textContent = `${selectedCount} selected`;
    if(applyBtn){
      const action = actionEl ? actionEl.value : '';
      applyBtn.disabled = selectedCount < 1 || !action;
    }
    if(selectAll){
      selectAll.checked = selectedCount > 0 && selectedCount === rowChecks.length;
      selectAll.indeterminate = selectedCount > 0 && selectedCount < rowChecks.length;
    }
  };

  const initDataTable = (wrap)=>{
    const table = wrap.querySelector('table');
    const tbody = table?.querySelector('tbody');
    if(!table || !tbody) return;
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.forEach((row, idx)=>{
      if(!row.getAttribute('data-ss-row-id')) row.setAttribute('data-ss-row-id', `row-${idx+1}`);
    });
    const mode = (wrap.getAttribute('data-ss-data-table-mode') || 'client').toLowerCase() === 'server' ? 'server' : 'client';
    const pageSizeAttr = Number(wrap.getAttribute('data-ss-page-size') || 20);
    const totalRowsAttr = Number(wrap.getAttribute('data-ss-total-rows'));
    const paginationMinAttr = Number(wrap.getAttribute('data-ss-pagination-min') || 20);
    const disableSearchAttr = wrap.getAttribute('data-ss-disable-search');
    const enableSearchAttr = wrap.getAttribute('data-ss-enable-search');
    const searchEnabled = !isTruthyAttr(disableSearchAttr) && !isFalsyAttr(enableSearchAttr);
    const state = {
      rows,
      page:1,
      pageSize: Number.isFinite(pageSizeAttr) && pageSizeAttr > 0 ? pageSizeAttr : 20,
      paginationMin: Number.isFinite(paginationMinAttr) && paginationMinAttr >= 0 ? paginationMinAttr : 20,
      searchEnabled,
      query:'',
      sortIndex:null,
      sortDir:'asc',
      sortType:'text',
      mode,
      totalRows: Number.isFinite(totalRowsAttr) && totalRowsAttr >= 0 ? totalRowsAttr : rows.length,
      requestSeq: 0,
      serverProvider: null
    };
    const endpoint = wrap.getAttribute('data-ss-data-table-endpoint');
    if(mode === 'server' && endpoint){
      state.serverProvider = async (params)=>{
        const url = new URL(endpoint, window.location.origin);
        url.searchParams.set('page', String(params.page));
        url.searchParams.set('pageSize', String(params.pageSize));
        if(params.query) url.searchParams.set('query', params.query);
        if(params.sortIndex !== null) url.searchParams.set('sortIndex', String(params.sortIndex));
        if(params.sortDir) url.searchParams.set('sortDir', String(params.sortDir));
        if(params.sortType) url.searchParams.set('sortType', String(params.sortType));
        const data = await window.SSUI.ajax(url.toString(), {method:'GET'});
        return typeof data === 'string' ? {rowsHtml: data, total: 0} : data;
      };
    }
    const searchField = wrap.querySelector('[data-ss-data-table-search]');
    const searchTools = searchField?.closest('.ss-data-table-tools');
    if(!searchEnabled){
      if(searchField){
        searchField.value = '';
        searchField.disabled = true;
      }
      if(searchTools){
        searchTools.style.display = 'none';
      }
    }
    dataTableState.set(wrap, state);
    updateDataTableBulkUi(wrap);
  };

  const getRowCellSortValue = (row, idx)=>{
    const cell = row.children[idx];
    const raw = (cell?.getAttribute('data-sort') ?? cell?.textContent ?? '').trim();
    return raw;
  };

  const renderDataTable = (wrap)=>{
    const state = dataTableState.get(wrap);
    const table = wrap.querySelector('table');
    const tbody = table?.querySelector('tbody');
    const info = wrap.querySelector('[data-ss-page-info]');
    const prevBtn = wrap.querySelector('[data-ss-page-prev]');
    const nextBtn = wrap.querySelector('[data-ss-page-next]');
    if(!state || !table || !tbody) return;
    let filtered = state.rows.filter(row=>row.textContent.toLowerCase().includes(state.query));
    if(state.sortIndex !== null){
      filtered = [...filtered].sort((a,b)=>{
        const aVal = getRowCellSortValue(a, state.sortIndex);
        const bVal = getRowCellSortValue(b, state.sortIndex);
        if(state.sortType === 'number'){
          const aNum = parseFloat(aVal.replace(/[^0-9.-]/g,'')) || 0;
          const bNum = parseFloat(bVal.replace(/[^0-9.-]/g,'')) || 0;
          return state.sortDir === 'asc' ? aNum - bNum : bNum - aNum;
        }
        return state.sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    const total = state.mode === 'server' ? (Number(state.totalRows) || 0) : filtered.length;
    const paginationWrap = wrap.querySelector('.ss-data-table-actions');
    const showPagination = total > state.paginationMin;
    if(paginationWrap){
      paginationWrap.style.display = showPagination ? '' : 'none';
    }
    if(!showPagination){
      state.page = 1;
    }
    const pages = Math.max(1, Math.ceil(total / state.pageSize));
    if(state.page > pages) state.page = pages;
    const start = (state.page - 1) * state.pageSize;
    const end = start + state.pageSize;
    if(state.mode === 'server'){
      Array.from(tbody.querySelectorAll('tr')).forEach(r=>{ r.style.display = ''; });
    }else{
      state.rows.forEach(r=>{ r.style.display = 'none'; });
      const pageRows = filtered.slice(start, end);
      pageRows.forEach(r=>{ r.style.display = ''; });
      pageRows.forEach(r=>tbody.appendChild(r));
    }
    if(info) info.textContent = `Page ${state.page}/${pages} · ${total} rows`;
    if(prevBtn) prevBtn.disabled = state.page <= 1;
    if(nextBtn) nextBtn.disabled = state.page >= pages;
    updateDataTableBulkUi(wrap);
  };

  const initAllDataTables = ()=>{
    document.querySelectorAll('[data-ss-data-table]').forEach(wrap=>{
      initDataTable(wrap);
      refreshDataTable(wrap);
    });
  };

  const initStandardPagination = ()=>{
    document.querySelectorAll('.ss-pagination-nav[data-ss-total]').forEach(nav=>{
      const total = Number(nav.getAttribute('data-ss-total'));
      const min = Number(nav.getAttribute('data-ss-pagination-min') || 20);
      if(Number.isFinite(total) && Number.isFinite(min) && total <= min){
        nav.style.display = 'none';
      }
    });
  };

  const setStepperIndex = (wrap, index)=>{
    const steps = Array.from(wrap.querySelectorAll('[data-ss-step]'));
    const dots = Array.from(wrap.querySelectorAll('[data-ss-step-dot]'));
    if(!steps.length) return;
    const safe = Math.max(0, Math.min(steps.length - 1, index));
    wrap.setAttribute('data-ss-step-index', String(safe));
    steps.forEach((step, i)=>{
      step.classList.toggle('is-active', i === safe);
    });
    dots.forEach((dot, i)=>{
      dot.classList.toggle('is-active', i <= safe);
    });
  };

  const initAllSteppers = ()=>{
    document.querySelectorAll('[data-ss-stepper]').forEach(wrap=>{
      const current = Number(wrap.getAttribute('data-ss-step-index') || 0);
      setStepperIndex(wrap, current);
    });
  };

  const openCommand = ()=>{
    const cmd = document.getElementById('ss-command');
    if(!cmd) return;
    cmd.classList.add('is-open');
    cmd.setAttribute('aria-hidden','false');
    const input = cmd.querySelector('[data-ss-command-input]');
    if(input) setTimeout(()=>input.focus(), 0);
  };

  const closeCommand = ()=>{
    const cmd = document.getElementById('ss-command');
    if(!cmd) return;
    cmd.classList.remove('is-open');
    cmd.setAttribute('aria-hidden','true');
  };

  const closeNavMenus = ()=>{
    document.querySelectorAll('.ss-nav-group.is-open').forEach(group=>{
      group.classList.remove('is-open');
      const btn = group.querySelector('[data-ss-nav-toggle]');
      if(btn) btn.setAttribute('aria-expanded','false');
    });
  };

  const toggleAccordionItem = (trigger)=>{
    const item = trigger.closest('.ss-accordion-item');
    const wrap = trigger.closest('[data-ss-accordion]');
    if(!item || !wrap) return;
    const multi = wrap.getAttribute('data-ss-accordion') === 'multi';
    const willOpen = !item.classList.contains('is-open');
    if(!multi){
      wrap.querySelectorAll('.ss-accordion-item.is-open').forEach(openItem=>{
        if(openItem !== item){
          openItem.classList.remove('is-open');
          const t = openItem.querySelector('[data-ss-accordion-trigger]');
          const p = openItem.querySelector('[data-ss-accordion-panel]');
          if(t) t.setAttribute('aria-expanded','false');
          if(p) p.setAttribute('aria-hidden','true');
        }
      });
    }
    item.classList.toggle('is-open', willOpen);
    trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    const panel = item.querySelector('[data-ss-accordion-panel]');
    if(panel){
      panel.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
    }
  };

  const initAccordions = ()=>{
    document.querySelectorAll('[data-ss-accordion]').forEach((wrap, wrapIdx)=>{
      wrap.querySelectorAll('.ss-accordion-item').forEach((item, idx)=>{
        const trigger = item.querySelector('[data-ss-accordion-trigger]');
        const panel = item.querySelector('[data-ss-accordion-panel]');
        if(!trigger || !panel) return;
        const panelId = panel.id || `ss-accordion-panel-${wrapIdx}-${idx}`;
        const triggerId = trigger.id || `ss-accordion-trigger-${wrapIdx}-${idx}`;
        panel.id = panelId;
        trigger.id = triggerId;
        trigger.setAttribute('aria-controls', panelId);
        panel.setAttribute('aria-labelledby', triggerId);
        const isOpen = item.classList.contains('is-open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      });
    });
  };

  document.addEventListener('click', (e)=>{
    const accordionTrigger = e.target.closest('[data-ss-accordion-trigger]');
    if(accordionTrigger){
      toggleAccordionItem(accordionTrigger);
      return;
    }

    const tabBtn = e.target.closest('[data-ss-tab]');
    if(tabBtn){
      showTab(tabBtn.getAttribute('data-ss-tab'), tabBtn);
    }
    const flowBtn = e.target.closest('[data-ss-flow]');
    if(flowBtn){
      showFlow(flowBtn.getAttribute('data-ss-flow'));
    }

    const sortTh = e.target.closest('th[data-ss-sort]');
    if(sortTh){
      const table = sortTh.closest('table');
      if(!table) return;
      const dataTableWrap = sortTh.closest('[data-ss-data-table]');
      if(dataTableWrap){
        const state = dataTableState.get(dataTableWrap);
        if(state){
          const idx = Array.from(sortTh.parentElement.children).indexOf(sortTh);
          const current = sortTh.classList.contains('is-asc') ? 'asc' : (sortTh.classList.contains('is-desc') ? 'desc' : 'none');
          const next = current === 'asc' ? 'desc' : 'asc';
          table.querySelectorAll('th[data-ss-sort]').forEach(th=>th.classList.remove('is-asc','is-desc'));
          sortTh.classList.add(next === 'asc' ? 'is-asc' : 'is-desc');
          updateTableSortA11y(table, sortTh);
          state.sortIndex = idx;
          state.sortDir = next;
          state.sortType = sortTh.getAttribute('data-ss-sort') || 'text';
          state.page = 1;
          refreshDataTable(dataTableWrap);
        }
        return;
      }
      const tbody = table.querySelector('tbody');
      if(!tbody) return;
      const idx = Array.from(sortTh.parentElement.children).indexOf(sortTh);
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const current = sortTh.classList.contains('is-asc') ? 'asc' : (sortTh.classList.contains('is-desc') ? 'desc' : 'none');
      const next = current === 'asc' ? 'desc' : 'asc';
      table.querySelectorAll('th[data-ss-sort]').forEach(th=>th.classList.remove('is-asc','is-desc'));
      sortTh.classList.add(next === 'asc' ? 'is-asc' : 'is-desc');
      updateTableSortA11y(table, sortTh);
      const isNumeric = sortTh.getAttribute('data-ss-sort') === 'number';
      rows.sort((a,b)=>{
        const aCell = a.children[idx];
        const bCell = b.children[idx];
        const aText = (aCell?.getAttribute('data-sort') ?? aCell?.textContent ?? '').trim();
        const bText = (bCell?.getAttribute('data-sort') ?? bCell?.textContent ?? '').trim();
        if(isNumeric){
          const aNum = parseFloat(aText.replace(/[^0-9.-]/g,'')) || 0;
          const bNum = parseFloat(bText.replace(/[^0-9.-]/g,'')) || 0;
          return next === 'asc' ? aNum - bNum : bNum - aNum;
        }
        return next === 'asc' ? aText.localeCompare(bText) : bText.localeCompare(aText);
      });
      rows.forEach(r=>tbody.appendChild(r));
    }

    const row = e.target.closest('tr[data-ss-row]');
    if(row){
      const action = row.getAttribute('data-ss-row-action');
      const value = row.getAttribute('data-ss-row-value');
      if(action === 'navigate' && value){
        window.location.href = value;
      }else if(action === 'modal' && value){
        const btn = document.querySelector(`[data-ss-modal-open=\"${value}\"]`);
        if(btn){
          btn.click();
        }else{
          const modal = document.getElementById(value);
          if(modal){
            requestAnimationFrame(()=>modal.classList.add('is-open'));
          }
        }
      }else{
        if(window.SSUI && typeof window.SSUI.onRowAction === 'function'){
          window.SSUI.onRowAction({row, action, value});
        }
      }
    }

    const openModal = e.target.closest('[data-ss-modal-open]');
    if(openModal){
      const id = openModal.getAttribute('data-ss-modal-open');
      let modal = document.getElementById(id);
      if(!modal){
        const tplId = openModal.getAttribute('data-ss-modal-template');
        if(tplId){
          const tpl = document.getElementById(tplId);
          if(tpl && 'content' in tpl){
            modal = tpl.content.firstElementChild.cloneNode(true);
            modal.setAttribute('data-ss-dynamic','true');
            modal.setAttribute('aria-hidden','true');
            const host = document.querySelector('.ss-ui') || document.body;
      host.appendChild(modal);
          }
        }
      }
      if(modal){
        requestAnimationFrame(()=>openModalWithAnim(modal));
      }
    }

    const closeModal = e.target.closest('[data-ss-modal-close]');
    if(closeModal){
      const modal = closeModal.closest('.ss-modal');
      closeModalWithAnim(modal);
    }

    const confirmChoiceBtn = e.target.closest('[data-ss-confirm-choice]');
    if(confirmChoiceBtn){
      const modal = confirmChoiceBtn.closest('.ss-modal');
      const choice = (confirmChoiceBtn.getAttribute('data-ss-confirm-choice') || '').toLowerCase();
      const truthy = ['yes','ok','continue','confirm','true','accept'];
      settleConfirm(modal, truthy.includes(choice));
      closeModalWithAnim(modal);
      return;
    }

    const closeAlert = e.target.closest('[data-ss-alert-close]');
    if(closeAlert){
      const alert = closeAlert.closest('.ss-alert');
      if(alert){
        alert.classList.add('is-hidden');
        alert.setAttribute('aria-hidden', 'true');
      }
    }

    const closeToast = e.target.closest('[data-ss-toast-close]');
    if(closeToast){
      const toast = closeToast.closest('.ss-toast');
      dismissToastWithAnim(toast);
    }

    const transferActionBtn = e.target.closest('[data-ss-transfer-action]');
    if(transferActionBtn){
      handleTransferAction(transferActionBtn);
    }
  });

  document.addEventListener('click', (e)=>{
    const navToggle = e.target.closest('[data-ss-nav-toggle]');
    if(navToggle){
      const group = navToggle.closest('.ss-nav-group');
      const willOpen = !group?.classList.contains('is-open');
      closeNavMenus();
      if(group && willOpen){
        group.classList.add('is-open');
        navToggle.setAttribute('aria-expanded','true');
      }
      return;
    }else if(!e.target.closest('.ss-nav-group')){
      closeNavMenus();
    }

    const drawerOpen = e.target.closest('[data-ss-drawer-open]');
    if(drawerOpen){
      openDrawer(drawerOpen.getAttribute('data-ss-drawer-open'));
    }
    const drawerClose = e.target.closest('[data-ss-drawer-close]');
    if(drawerClose){
      closeDrawer(drawerClose.closest('.ss-drawer'));
    }
    const drawerBackdrop = e.target.closest('.ss-drawer-backdrop');
    if(drawerBackdrop){
      closeDrawer(drawerBackdrop.closest('.ss-drawer'));
    }

    const popToggle = e.target.closest('[data-ss-popover-toggle]');
    if(popToggle){
      const id = popToggle.getAttribute('data-ss-popover-toggle');
      togglePopover(id, popToggle);
      return;
    }
    if(!e.target.closest('.ss-popover') && !e.target.closest('[data-ss-popover-toggle]')){
      document.querySelectorAll('.ss-popover.is-open').forEach(p=>p.classList.remove('is-open'));
    }

    const comboOpt = e.target.closest('[data-ss-combobox-option]');
    if(comboOpt){
      const wrap = comboOpt.closest('[data-ss-combobox]');
      const api = wrap?.__ssCombobox;
      if(api) api.addValue(comboOpt.getAttribute('data-ss-combobox-option'));
    }
    const comboRemove = e.target.closest('[data-ss-tag-remove]');
    if(comboRemove){
      const wrap = comboRemove.closest('[data-ss-combobox]');
      const api = wrap?.__ssCombobox;
      const value = comboRemove.getAttribute('data-ss-tag-remove');
      if(api && value){
        api.selectedValues.delete(value);
        api.renderTags();
        api.renderOptions();
      }
    }

    const colToggle = e.target.closest('[data-ss-col-toggle]');
    if(colToggle){
      const wrap = colToggle.closest('[data-ss-data-table]');
      const col = colToggle.getAttribute('data-ss-col-toggle');
      const checked = colToggle.checked;
      if(wrap && col){
        wrap.querySelectorAll(`[data-ss-col="${col}"]`).forEach(cell=>{
          cell.classList.toggle('is-hidden', !checked);
        });
      }
    }

    const prev = e.target.closest('[data-ss-page-prev]');
    const next = e.target.closest('[data-ss-page-next]');
    if(prev || next){
      const wrap = (prev || next).closest('[data-ss-data-table]');
      const state = wrap ? dataTableState.get(wrap) : null;
      if(state){
        state.page += prev ? -1 : 1;
        refreshDataTable(wrap);
      }
    }

    const selectAll = e.target.closest('[data-ss-select-all]');
    if(selectAll){
      const table = selectAll.closest('table');
      if(table){
        table.querySelectorAll('[data-ss-row-select]').forEach(cb=>{ cb.checked = selectAll.checked; });
      }
    }

    const bulkApply = e.target.closest('[data-ss-bulk-apply]');
    if(bulkApply){
      const wrap = bulkApply.closest('[data-ss-data-table]');
      const table = wrap?.querySelector('table');
      const action = wrap?.querySelector('[data-ss-bulk-action]')?.value || '';
      if(wrap && table && action){
        const rows = Array.from(table.querySelectorAll('tbody tr')).filter(row=>row.querySelector('[data-ss-row-select]')?.checked);
        const rowIds = rows.map(row=>row.getAttribute('data-ss-row-id') || '');
        if(window.SSUI && typeof window.SSUI.onTableBulkAction === 'function'){
          window.SSUI.onTableBulkAction({action, rows, rowIds, tableWrap: wrap});
        }else{
          window.SSUI.showToast({
            type:'info',
            title:'Bulk Action',
            text:`${action} applied to ${rowIds.length} row(s).`
          });
        }
      }
    }

    const stepNext = e.target.closest('[data-ss-step-next]');
    const stepBack = e.target.closest('[data-ss-step-back]');
    if(stepNext || stepBack){
      const wrap = (stepNext || stepBack).closest('[data-ss-stepper]');
      const current = Number(wrap?.getAttribute('data-ss-step-index') || 0);
      setStepperIndex(wrap, current + (stepNext ? 1 : -1));
    }

    const cmdOpen = e.target.closest('[data-ss-command-open]');
    if(cmdOpen) openCommand();
    const cmdClose = e.target.closest('[data-ss-command-close], .ss-command-backdrop');
    if(cmdClose) closeCommand();
    const cmdItem = e.target.closest('[data-ss-command-item]');
    if(cmdItem){
      const action = cmdItem.getAttribute('data-ss-command-item') || cmdItem.textContent.trim();
      closeCommand();
      window.SSUI.showToast({type:'info', title:'Command', text:`Executed: ${action}`});
    }

    const rowBtn = e.target.closest('[data-ss-row-btn]');
    if(rowBtn){
      const action = rowBtn.getAttribute('data-ss-row-btn');
      const rowId = rowBtn.getAttribute('data-ss-row-id');
      const row = rowBtn.closest('tr');
      if(window.SSUI && typeof window.SSUI.onTableRowAction === 'function'){
        window.SSUI.onTableRowAction({action, rowId, row, button: rowBtn});
      }else{
        window.SSUI.showToast({
          type: action === 'delete' ? 'warn' : 'info',
          title: action === 'delete' ? 'Delete Row' : 'Edit Row',
          text: `${action} action triggered for ${rowId || 'row'}.`
        });
      }
      return;
    }
  });

  document.addEventListener('change', (e)=>{
    const target = e.target;
    if(target && target.matches('input[type="file"]')){
      const wrap = target.closest('.ss-upload');
      const textEl = wrap?.querySelector('.ss-upload-text');
      const file = target.files && target.files[0];
      if(file){
        if(textEl) textEl.innerHTML = '<strong>Selected:</strong> ' + file.name;
      }else{
        if(textEl) textEl.innerHTML = '<strong>Drag &amp; drop</strong> a file here or <strong>choose file</strong>';
      }
    }
    if(target && target.matches('[data-ss-validate],[data-ss-required]')){
      validateField(target);
    }
    const transfer = target?.closest?.('[data-ss-transfer]');
    if(transfer){
      updateTransferFilters(transfer);
      updateTransferUi(transfer);
    }
    if(target && target.matches('[data-ss-page-size]')){
      const wrap = target.closest('[data-ss-data-table]');
      const state = wrap ? dataTableState.get(wrap) : null;
      if(state){
        state.pageSize = Math.max(1, Number(target.value) || 5);
        state.page = 1;
        refreshDataTable(wrap);
      }
    }
    if(target && target.matches('[data-ss-col-toggle]')){
      const wrap = target.closest('[data-ss-data-table]');
      const col = target.getAttribute('data-ss-col-toggle');
      const checked = target.checked;
      if(wrap && col){
        wrap.querySelectorAll(`[data-ss-col="${col}"]`).forEach(cell=>{
          cell.classList.toggle('is-hidden', !checked);
        });
      }
    }
    if(target && target.matches('[data-ss-select-all]')){
      const table = target.closest('table');
      if(table){
        table.querySelectorAll('[data-ss-row-select]').forEach(cb=>{ cb.checked = target.checked; });
      }
      const wrap = target.closest('[data-ss-data-table]');
      if(wrap) updateDataTableBulkUi(wrap);
    }
    if(target && target.matches('[data-ss-row-select],[data-ss-bulk-action]')){
      const wrap = target.closest('[data-ss-data-table]');
      if(wrap) updateDataTableBulkUi(wrap);
    }
  });

  // File upload drag/drop + click
  document.addEventListener('click', (e)=>{
    const drop = e.target.closest('.ss-upload-drop');
    if(drop){
      if(drop.closest('label')) return;
      const wrap = drop.closest('.ss-upload');
      const input = wrap?.querySelector('input[type=\"file\"]');
      if(input) input.click();
    }
  });

  document.addEventListener('dragover', (e)=>{
    const drop = e.target.closest('.ss-upload-drop');
    if(drop){
      e.preventDefault();
      drop.classList.add('is-dragover');
    }
  });

  document.addEventListener('dragleave', (e)=>{
    const drop = e.target.closest('.ss-upload-drop');
    if(drop){
      drop.classList.remove('is-dragover');
    }
  });

  document.addEventListener('drop', (e)=>{
    const drop = e.target.closest('.ss-upload-drop');
    if(drop){
      e.preventDefault();
      drop.classList.remove('is-dragover');
      const wrap = drop.closest('.ss-upload');
      const input = wrap?.querySelector('input[type=\"file\"]');
      if(input && e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length){
        try{
          input.files = e.dataTransfer.files;
        }catch(err){
          // Some browsers restrict programmatic file assignment
        }
        const evt = new Event('change', {bubbles:true});
        input.dispatchEvent(evt);
      }
    }
  });

  // Close modal on ESC
  document.addEventListener('keydown', (e)=>{
    const keyTarget = e.target;
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'){
      e.preventDefault();
      openCommand();
      return;
    }
    if(e.key === 'Enter' && keyTarget instanceof HTMLElement && keyTarget.matches('[data-ss-combobox-input]')){
      const wrap = keyTarget.closest('[data-ss-combobox]');
      const api = wrap?.__ssCombobox;
      if(api){
        e.preventDefault();
        api.addValue(keyTarget.value);
      }
    }
    const isActivate = e.key === 'Enter' || e.key === ' ';
    if(isActivate && keyTarget instanceof HTMLElement){
      const sortTh = keyTarget.closest('th[data-ss-sort]');
      if(sortTh){
        e.preventDefault();
        sortTh.click();
        return;
      }
      const row = keyTarget.closest('tr[data-ss-row]');
      if(row){
        e.preventDefault();
        row.click();
        return;
      }
    }
    if(e.key === 'Escape'){
      closeCommand();
      closeNavMenus();
      document.querySelectorAll('.ss-popover.is-open').forEach(p=>p.classList.remove('is-open'));
      document.querySelectorAll('.ss-drawer.is-open').forEach(d=>closeDrawer(d));
      const modals = document.querySelectorAll('.ss-modal.is-open');
      if(modals.length){
        modals.forEach(m=>closeModalWithAnim(m));
        return;
      }
      const toasts = document.querySelectorAll('.ss-toast');
      if(toasts.length){
        dismissToastWithAnim(toasts[toasts.length - 1]);
      }
    }
  });

  // Reveal animation
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.style.opacity='1';
        e.target.style.transform='translateY(0)';
      }
    })
  },{threshold:.12});

  document.querySelectorAll('.ss-node').forEach((n,i)=>{
    n.style.opacity='0';
    n.style.transform='translateY(16px)';
    n.style.transition=`opacity .45s ease ${i*.06}s, transform .45s ease ${i*.06}s`;
    observer.observe(n);
  });

  // Default state
  showFlow('hs');
  initA11yScaffolding();
  initAccordions();
  initTransferLists();
  initAllComboboxes();
  initAllDataTables();
  initStandardPagination();
  initAllSteppers();

  // Progress helper (static)
  window.SSUI = window.SSUI || {};
  window.SSUI.setProgress = function(el, value){
    if(!el) return;
    const pct = Math.max(0, Math.min(100, Number(value)));
    el.style.setProperty('--ss-progress', pct + '%');
    const meta = el.querySelector('.ss-progress-meta');
    if(meta) meta.textContent = pct + '%';
  };

  // Button loading helper
  window.SSUI.setButtonLoading = function(btn, isLoading, label){
    if(!btn) return;
    const text = label || btn.getAttribute('data-ss-label') || btn.textContent;
    if(isLoading){
      btn.setAttribute('data-ss-label', text);
      btn.classList.add('is-loading');
      btn.textContent = text;
    }else{
      btn.classList.remove('is-loading');
      const original = btn.getAttribute('data-ss-label');
      if(original) btn.textContent = original;
    }
  };

  window.SSUI.confirm = function(options){
    const opts = Object.assign({
      title: 'Confirm Action',
      message: 'Are you sure you want to continue?',
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
      confirmChoice: 'confirm',
      cancelChoice: 'cancel',
      tone: 'primary'
    }, options || {});
    return new Promise((resolve)=>{
      const modal = document.createElement('div');
      modal.className = 'ss-modal';
      modal.setAttribute('data-ss-dynamic', 'true');
      modal.setAttribute('data-ss-confirm-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML =
        '<div class="ss-modal-backdrop" data-ss-modal-close></div>' +
        '<div class="ss-modal-panel" role="dialog" aria-modal="true" aria-label="' + String(opts.title).replace(/"/g, '&quot;') + '">' +
          '<div class="ss-modal-head">' +
            '<div class="ss-modal-title">' + String(opts.title) + '</div>' +
            '<button class="ss-modal-close" type="button" data-ss-modal-close aria-label="Close">×</button>' +
          '</div>' +
          '<div class="ss-modal-body">' +
            '<p class="ss-help" style="font-size:.9rem;line-height:1.6">' + String(opts.message) + '</p>' +
            '<div class="ss-actions" style="justify-content:flex-end">' +
              '<button class="ss-btn ghost" type="button" data-ss-confirm-choice="' + String(opts.cancelChoice) + '">' + String(opts.cancelLabel) + '</button>' +
              '<button class="ss-btn ' + (opts.tone === 'ghost' ? 'ghost' : (opts.tone === 'danger' ? 'danger' : 'primary')) + '" type="button" data-ss-confirm-choice="' + String(opts.confirmChoice) + '">' + String(opts.confirmLabel) + '</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      const host = document.querySelector('.ss-ui') || document.body;
      host.appendChild(modal);
      confirmState.set(modal, {resolve, settled:false});
      requestAnimationFrame(()=>openModalWithAnim(modal));
    });
  };

  window.SSUI.openDrawer = openDrawer;
  window.SSUI.closeDrawer = closeDrawer;
  window.SSUI.openCommandPalette = openCommand;
  window.SSUI.closeCommandPalette = closeCommand;
  window.SSUI.setHeaderFixed = function(headerEl, isFixed){
    if(!headerEl) return;
    headerEl.classList.toggle('is-fixed', !!isFixed);
  };
  window.SSUI.setTheme = function(theme){
    const dark = document.getElementById('ss-theme-dark');
    const light = document.getElementById('ss-theme-light');
    const next = theme === 'light' ? 'light' : 'dark';
    if(dark && light){
      dark.disabled = next === 'light';
      light.disabled = next !== 'light';
    }
    document.documentElement.setAttribute('data-ss-theme', next);
    return next;
  };
  window.SSUI.getTheme = function(){
    return document.documentElement.getAttribute('data-ss-theme') || 'dark';
  };
  window.SSUI.getTableSelectedRows = function(tableWrap){
    const table = tableWrap?.querySelector?.('table');
    if(!table) return [];
    return Array.from(table.querySelectorAll('tbody tr')).filter(row=>row.querySelector('[data-ss-row-select]')?.checked);
  };
  window.SSUI.setDataTableServerProvider = function(tableWrap, provider){
    const state = dataTableState.get(tableWrap);
    if(!state) return false;
    state.mode = 'server';
    state.serverProvider = typeof provider === 'function' ? provider : null;
    state.page = 1;
    refreshDataTable(tableWrap);
    return true;
  };
  window.SSUI.setDataTableMode = function(tableWrap, mode){
    const state = dataTableState.get(tableWrap);
    if(!state) return false;
    state.mode = String(mode || '').toLowerCase() === 'server' ? 'server' : 'client';
    state.page = 1;
    refreshDataTable(tableWrap);
    return true;
  };
  window.SSUI.refreshDataTable = function(tableWrap){
    refreshDataTable(tableWrap);
  };
  window.SSUI.getDataTableParams = function(tableWrap){
    const state = dataTableState.get(tableWrap);
    if(!state) return null;
    return {...getDataTableParams(state), mode: state.mode, totalRows: state.totalRows};
  };

  // Use SSUI validation UI instead of browser-native validation bubbles by default.
  document.querySelectorAll('form').forEach((form)=>{
    if(!(form instanceof HTMLFormElement)) return;
    if(form.getAttribute('data-ss-native-validate') === 'true') return;
    form.setAttribute('novalidate', 'novalidate');
  });

  // Alert helper
  window.SSUI.setAlert = function(el, options){
    if(!el) return;
    const opts = Object.assign({type:'info', title:'Info', text:'', visible:true}, options || {});
    const allowed = ['info','success','warn','error'];
    const type = allowed.includes(opts.type) ? opts.type : 'info';
    const a11y = getToastA11y(type, opts.live);
    el.classList.remove('is-info','is-success','is-warn','is-error');
    el.classList.add('is-' + type);
    el.setAttribute('role', a11y.role);
    el.setAttribute('aria-live', a11y.live);
    const titleEl = el.querySelector('.ss-alert-title');
    const textEl = el.querySelector('.ss-alert-text');
    if(titleEl && typeof opts.title === 'string') titleEl.textContent = opts.title;
    if(textEl && typeof opts.text === 'string') textEl.textContent = opts.text;
    el.classList.toggle('is-hidden', opts.visible === false);
    el.setAttribute('aria-hidden', opts.visible === false ? 'true' : 'false');
  };

  // Toast helpers
  window.SSUI.showToast = function(options){
    const opts = typeof options === 'string' ? {text: options} : (options || {});
    const title = opts.title || 'Notification';
    const text = opts.text || '';
    const type = ['info','success','warn','error'].includes(opts.type) ? opts.type : 'info';
    const a11y = getToastA11y(type, opts.live);
    const duration = Number(opts.duration ?? 5000);
    const viewport = ensureToastViewport();
    const toast = document.createElement('div');
    toast.className = 'ss-toast is-' + type;
    toast.setAttribute('role', a11y.role);
    toast.setAttribute('aria-live', a11y.live);
    toast.innerHTML =
      '<div>' +
        '<div class="ss-toast-title"></div>' +
        '<div class="ss-toast-text"></div>' +
      '</div>' +
      '<button type="button" class="ss-toast-close" data-ss-toast-close aria-label="Dismiss">×</button>';
    const tTitle = toast.querySelector('.ss-toast-title');
    const tText = toast.querySelector('.ss-toast-text');
    if(tTitle) tTitle.textContent = title;
    if(tText) tText.textContent = text;
    viewport.appendChild(toast);
    if(duration > 0){
      setTimeout(()=>dismissToastWithAnim(toast), duration);
    }
    return toast;
  };

  window.SSUI.clearToasts = function(){
    document.querySelectorAll('.ss-toast').forEach(t=>dismissToastWithAnim(t));
  };

  // Empty state helper
  window.SSUI.setEmptyState = function(container, isEmpty){
    if(!container) return;
    const showEmpty = !!isEmpty;
    const emptyEl = container.querySelector('[data-ss-empty]');
    const itemsEl = container.querySelector('[data-ss-items]');
    if(emptyEl){
      emptyEl.style.display = showEmpty ? '' : 'none';
      emptyEl.setAttribute('aria-hidden', showEmpty ? 'false' : 'true');
    }
    if(itemsEl){
      itemsEl.style.display = showEmpty ? 'none' : '';
      itemsEl.setAttribute('aria-hidden', showEmpty ? 'true' : 'false');
    }
  };

  // Skeleton helper
  window.SSUI.setSkeletonLoading = function(container, isLoading){
    if(!container) return;
    container.setAttribute('data-ss-loading', isLoading ? 'true' : 'false');
    container.setAttribute('aria-busy', isLoading ? 'true' : 'false');
  };

  window.SSUI.getTransferValues = function(container){
    if(!container) return [];
    const selected = container.querySelector('[data-ss-transfer-selected]');
    if(!selected) return [];
    return Array.from(selected.options).map(o=>o.value);
  };

  window.SSUI.setTransferValues = function(container, values){
    if(!container) return;
    const source = container.querySelector('[data-ss-transfer-source]');
    const selected = container.querySelector('[data-ss-transfer-selected]');
    if(!source || !selected) return;
    const targetValues = new Set((values || []).map(String));
    const all = [...Array.from(source.options), ...Array.from(selected.options)];
    all.forEach(opt=>{
      if(targetValues.has(String(opt.value))) selected.appendChild(opt);
      else source.appendChild(opt);
      opt.selected = false;
    });
    updateTransferFilters(container);
    updateTransferUi(container);
    validateField(selected);
  };

  // Ajax helper
  window.SSUI.ajax = async function(url, options){
    const opts = Object.assign({method:'GET', headers:{}}, options || {});
    const res = await fetch(url, opts);
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : await res.text();
    if(!res.ok){
      const err = new Error('Request failed: ' + res.status);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  };

  // Form validation + submit
  function resolveValidationRule(field){
    const explicit = field.getAttribute('data-ss-validate');
    if(explicit) return explicit;
    const type = (field.getAttribute('type') || '').toLowerCase();
    if(type === 'email' || type === 'url' || type === 'number') return type;
    return '';
  }

  function validateField(field){
    const required = field.hasAttribute('data-ss-required') || field.required;
    const rule = resolveValidationRule(field);
    const isCheck = field.matches('input[type="checkbox"],input[type="radio"]');
    const isTransferSelected = field.matches('[data-ss-transfer-selected]');
    const value = isTransferSelected
      ? String(field.options.length)
      : (isCheck ? (field.checked ? 'checked' : '') : (field.value || '').trim());
    let error = '';
    if(required && !value){
      error = 'This field is required.';
    }else if(required && isTransferSelected && field.options.length < 1){
      error = 'Select at least one item.';
    }else if(value && rule){
      if(rule === 'email'){
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter a valid email.';
      }else if(rule === 'url'){
        try{ new URL(value); }catch{ error = 'Enter a valid URL.'; }
      }else if(rule === 'number'){
        if(isNaN(Number(value))) error = 'Enter a valid number.';
      }
    }
    if(!error && field.willValidate && typeof field.checkValidity === 'function' && !field.checkValidity()){
      if(field.validity?.valueMissing){
        error = 'This field is required.';
      }else if(field.validity?.typeMismatch){
        if(rule === 'email') error = 'Enter a valid email.';
        else if(rule === 'url') error = 'Enter a valid URL.';
        else error = 'Enter a valid value.';
      }else if(field.validity?.patternMismatch){
        error = 'Enter a valid value.';
      }else if(field.validity?.rangeUnderflow || field.validity?.rangeOverflow){
        error = 'Enter a value within the allowed range.';
      }else if(field.validity?.stepMismatch){
        error = 'Enter a valid increment.';
      }else{
        error = field.validationMessage || 'Enter a valid value.';
      }
    }

    field.classList.toggle('ss-error', !!error);
    field.setAttribute('aria-invalid', error ? 'true' : 'false');
    const wrap = field.closest('.ss-field');
    let errEl = wrap ? wrap.querySelector('.ss-field-error') : null;
    if(wrap && !errEl){
      errEl = document.createElement('div');
      errEl.className = 'ss-field-error';
      errEl.setAttribute('aria-live', 'polite');
      wrap.appendChild(errEl);
    }
    if(errEl){
      if(!errEl.id){
        const fallbackId = field.id ? `${field.id}-error` : `ss-field-error-${Math.random().toString(36).slice(2,8)}`;
        errEl.id = fallbackId;
      }
      errEl.textContent = error;
      const describedBy = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
      const withoutErr = describedBy.filter(id=>id !== errEl.id);
      if(error){
        withoutErr.push(errEl.id);
        field.setAttribute('aria-describedby', withoutErr.join(' '));
      }else if(withoutErr.length){
        field.setAttribute('aria-describedby', withoutErr.join(' '));
      }else{
        field.removeAttribute('aria-describedby');
      }
    }
    return !error;
  }

  function isValidatableField(field){
    if(!field || !(field instanceof Element)) return false;
    return field.matches('[data-ss-validate],[data-ss-required],[required],input[type="email"],input[type="url"],input[type="number"],input[pattern],input[min],input[max],textarea[required],select[required]');
  }

  document.addEventListener('input', (e)=>{
    const field = e.target;
    if(isValidatableField(field)){
      validateField(field);
    }
    if(field && field.matches('[data-ss-transfer-filter]')){
      const transfer = field.closest('[data-ss-transfer]');
      updateTransferFilters(transfer);
      updateTransferUi(transfer);
    }
    if(field && field.matches('[data-ss-combobox-input]')){
      const wrap = field.closest('[data-ss-combobox]');
      const api = wrap?.__ssCombobox;
      if(api) api.renderOptions();
    }
    if(field && field.matches('[data-ss-data-table-search]')){
      const wrap = field.closest('[data-ss-data-table]');
      const state = wrap ? dataTableState.get(wrap) : null;
      if(state && state.searchEnabled){
        state.query = (field.value || '').trim().toLowerCase();
        state.page = 1;
        refreshDataTable(wrap);
      }
    }
    if(field && field.matches('[data-ss-command-input]')){
      const q = (field.value || '').trim().toLowerCase();
      const cmd = field.closest('.ss-command');
      cmd?.querySelectorAll('[data-ss-command-item]').forEach(item=>{
        const txt = (item.textContent || '').toLowerCase();
        item.style.display = !q || txt.includes(q) ? '' : 'none';
      });
    }
  });

  document.addEventListener('submit', async (e)=>{
    const form = e.target;
    if(!form || !form.matches('[data-ss-form]')) return;
    e.preventDefault();
    const fields = form.querySelectorAll('[data-ss-validate],[data-ss-required],[required],input[type="email"],input[type="url"],input[type="number"],input[pattern],input[min],input[max],textarea[required],select[required]');
    let ok = true;
    fields.forEach(f=>{ if(!validateField(f)) ok = false; });
    if(!ok) return;

    form.querySelectorAll('[data-ss-transfer-selected]').forEach(select=>{
      Array.from(select.options).forEach(opt=>{ opt.selected = true; });
      validateField(select);
    });

    const submitBtn = form.querySelector('[type=\"submit\"]');
    if(submitBtn) window.SSUI.setButtonLoading(submitBtn, true);

    const endpoint = form.getAttribute('data-ss-endpoint');
    if(endpoint){
      try{
        const formData = new FormData(form);
        await window.SSUI.ajax(endpoint, {method:'POST', body:formData});
        if(window.SSUI && typeof window.SSUI.onFormSuccess === 'function'){
          window.SSUI.onFormSuccess(form);
        }
      }catch(err){
        if(window.SSUI && typeof window.SSUI.onFormError === 'function'){
          window.SSUI.onFormError(form, err);
        }
      }
    }else{
      if(window.SSUI && typeof window.SSUI.onFormSuccess === 'function'){
        window.SSUI.onFormSuccess(form);
      }
    }

    if(submitBtn) window.SSUI.setButtonLoading(submitBtn, false);
  });

  // Apply SSUI validation to regular forms too (non data-ss-form).
  document.addEventListener('submit', (e)=>{
    const form = e.target;
    if(!form || !(form instanceof HTMLFormElement)) return;
    if(e.defaultPrevented) return;
    if(form.matches('[data-ss-form]')) return;
    const fields = form.querySelectorAll('[data-ss-validate],[data-ss-required],[required],input[type="email"],input[type="url"],input[type="number"],input[pattern],input[min],input[max],textarea[required],select[required]');
    if(!fields.length) return;
    let ok = true;
    let firstInvalid = null;
    fields.forEach((f)=>{
      const valid = validateField(f);
      if(!valid){
        ok = false;
        if(!firstInvalid) firstInvalid = f;
      }
    });
    if(ok) return;
    e.preventDefault();
    e.stopPropagation();
    if(firstInvalid && typeof firstInvalid.focus === 'function'){
      firstInvalid.focus();
    }
  }, true);

  // Global submit loading for regular forms.
  // Skip SSUI ajax forms because they manage their own loading lifecycle.
  document.addEventListener('submit', (e)=>{
    const form = e.target;
    if(!form || !(form instanceof HTMLFormElement)) return;
    if(e.defaultPrevented) return;
    if(form.matches('[data-ss-form]')) return;
    if(form.getAttribute('data-ss-no-submit-loading') === 'true') return;
    const submitter = e.submitter instanceof HTMLElement
      ? e.submitter
      : form.querySelector('[type="submit"]');
    if(!submitter || !(submitter instanceof HTMLElement)) return;
    if(submitter.getAttribute('data-ss-no-loading') === 'true') return;
    const label = submitter.getAttribute('data-ss-loading-label') || undefined;
    if(window.SSUI && typeof window.SSUI.setButtonLoading === 'function'){
      window.SSUI.setButtonLoading(submitter, true, label);
    }
  }, true);

  // Default form behavior: prevent implicit Enter-submit on non-data-table forms.
  // Opt-out by setting data-ss-allow-enter-submit="true" on the form.
  document.addEventListener('keydown', (e)=>{
    if(e.key !== 'Enter') return;
    const target = e.target;
    if(!target || !(target instanceof Element)) return;
    if(target.matches('textarea,[contenteditable="true"]')) return;
    if(target.closest('[data-ss-data-table]')) return;
    const form = target.closest('form');
    if(!form) return;
    if(form.getAttribute('data-ss-allow-enter-submit') === 'true') return;
    const submitLike = target.matches('button,[type="submit"],[type="button"],[role="button"]');
    if(submitLike) return;
    e.preventDefault();
  });
})();
