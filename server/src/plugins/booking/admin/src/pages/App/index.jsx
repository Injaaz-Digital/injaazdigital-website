import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  Badge, Box, Button, Field, Flex, Grid, Loader, NumberInput, SingleSelect, SingleSelectOption,
  Table, Tabs, Tbody, Td, Textarea, TextInput, Th, Thead, Toggle, Tr, Typography,
} from '@strapi/design-system';
import { ArrowClockwise, Calendar, CheckCircle, Clock, Cog, Database, Discuss, File, Pencil, Plus, Question, Trash, User } from '@strapi/icons';
import { Layouts, Page, SearchInput, useFetchClient, useNotification } from '@strapi/strapi/admin';

const API = '/booking';
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const CHOICE_TYPES = new Set(['radio', 'select', 'checkbox']);
const DEFAULT_WEEK = DAYS.map((day, index) => ({ day, enabled: index < 5, startTime: '09:00', endTime: index === 4 ? '16:00' : '17:00' }));

const resourceConfig = {
  leads: { label: 'Leads', icon: User, description: 'Prospects, qualification and pipeline status', status: ['in_progress','partial','completed','unqualified','qualified','booked','attended','no_show','proposal_needed','proposal_sent','closed_won','closed_lost'] },
  meetings: { label: 'Meetings', icon: Calendar, description: 'Scheduled calls and meeting outcomes', status: ['scheduled','done','canceled','no_show','rescheduled'] },
  notes: { label: 'Lead notes', icon: File, description: 'Sales notes and follow-up context', editable: true },
  responses: { label: 'Responses', icon: Discuss, description: 'Answers submitted during qualification' },
  sessions: { label: 'Sessions', icon: Clock, description: 'Booking funnel sessions and expiry' },
  reservations: { label: 'Reservations', icon: Database, description: 'Slot locks, retries and provider synchronization' },
  audits: { label: 'Audit trail', icon: CheckCircle, description: 'Immutable booking lifecycle history' },
};

const Surface = styled(Box)`border:1px solid ${({theme})=>theme.colors.neutral200};background:${({theme})=>theme.colors.neutral0};`;
const Hero = styled(Surface)`background:radial-gradient(circle at 90% 5%,${({theme})=>theme.colors.primary200},transparent 30%),linear-gradient(135deg,${({theme})=>theme.colors.neutral0},${({theme})=>theme.colors.primary100});`;
const NavWrap = styled(Box)`position:sticky;top:0;z-index:2;overflow-x:auto;background:${({theme})=>theme.colors.neutral100};border-bottom:1px solid ${({theme})=>theme.colors.neutral200};&>div{min-width:max-content}`;
const DayRow = styled(Grid.Root)`padding:16px;border-bottom:1px solid ${({theme})=>theme.colors.neutral200};background:${({theme,$enabled})=>$enabled?theme.colors.success100:theme.colors.neutral100};opacity:${({$enabled})=>$enabled?1:.78};&:last-child{border-bottom:0}`;
const OptionRow = styled(Grid.Root)`padding:12px;border:1px solid ${({theme})=>theme.colors.neutral200};background:${({theme})=>theme.colors.neutral100};border-radius:${({theme})=>theme.borderRadius};`;
const Muted = ({ children }) => <Typography tag="p" variant="pi" textColor="neutral600">{children}</Typography>;
const labelize = (value) => String(value || '—').replaceAll('_', ' ');
const relationName = (value) => value?.name || value?.fullName || value?.email || (value?.id ? `#${value.id}` : '—');
const maximumQuestionScore = (question) => {
  const scores = Array.isArray(question.options) ? question.options.map((option) => Number(option?.score ?? option?.weight ?? 0) || 0) : [];
  if (question.type === 'checkbox') return scores.reduce((total, score) => total + Math.max(0, score), 0);
  if (question.type === 'radio' || question.type === 'select') return Math.max(0, ...scores);
  return Math.max(0, Number(question.weight) || 0);
};

function Dashboard({ onOpen }) {
  const { get } = useFetchClient();
  const [data, setData] = useState(null);
  useEffect(() => { get(`${API}/overview`).then((response) => setData(response.data?.data || response.data)); }, []);
  return <Flex direction="column" alignItems="stretch" gap={6}>
    <Hero padding={7} hasRadius><Badge backgroundColor="primary200" textColor="primary700">INJAAZ CAL OPERATIONS</Badge><Typography tag="h2" variant="alpha" marginTop={3}>Booking data lives here now.</Typography><Typography tag="p" textColor="neutral600" marginTop={2}>Manage the complete lead-to-meeting lifecycle without opening Content Manager.</Typography></Hero>
    <Grid.Root gap={4}>{Object.entries(resourceConfig).slice(0,4).map(([key,item])=><Grid.Item key={key} col={3} s={6} xs={12}><Surface padding={5} hasRadius><Flex justifyContent="space-between" alignItems="flex-start"><Box><Muted>{item.label.toUpperCase()}</Muted><Typography tag="p" variant="alpha" marginTop={2}>{data?.counts?.[key] ?? '—'}</Typography></Box><item.icon /></Flex><Button marginTop={4} variant="tertiary" onClick={()=>onOpen(key)}>Manage</Button></Surface></Grid.Item>)}</Grid.Root>
    <Surface hasRadius><Box padding={5}><Typography variant="delta" tag="h3">Recent meetings</Typography></Box><Table colCount={4} rowCount={data?.recentMeetings?.length || 0}><Thead><Tr><Th><Typography variant="sigma">Date</Typography></Th><Th><Typography variant="sigma">Lead</Typography></Th><Th><Typography variant="sigma">Status</Typography></Th><Th><Typography variant="sigma">Duration</Typography></Th></Tr></Thead><Tbody>{!data?<Tr><Td colSpan={4}><Flex padding={6} justifyContent="center"><Loader small>Loading</Loader></Flex></Td></Tr>:(data.recentMeetings||[]).map(item=><Tr key={item.id}><Td><Typography>{item.start?new Date(item.start).toLocaleString():'—'}</Typography></Td><Td><Typography fontWeight="semiBold">{relationName(item.lead)}</Typography></Td><Td><Badge>{labelize(item.status)}</Badge></Td><Td><Typography>{item.duration?`${item.duration} min`:'—'}</Typography></Td></Tr>)}</Tbody></Table></Surface>
  </Flex>;
}

function QuestionEditor({ value, locale = 'en', stepperId, onSaved, onCancel }) {
  const { post, put } = useFetchClient();
  const normalizeOptions = (options) => Array.isArray(options) ? options.map((option, index) => ({
    label: typeof option === 'string' ? option : option.label || '',
    value: typeof option === 'string' ? option.toLowerCase().replace(/\s+/g, '_') : option.value || `option_${index + 1}`,
    score: Number(typeof option === 'object' ? option.score ?? option.weight ?? 0 : 0),
  })) : [];
  const [form, setForm] = useState(() => ({
    title: '', key: 'Generated on save', type: 'radio', order: 1, weight: 0, required: true, active: true,
    locale, helpText: '', placeholder: '', options: [{ label: '', value: 'option_1', score: 0 }],
    ...(value || {}), options: normalizeOptions(value?.options?.length ? value.options : [{ label: '', value: 'option_1', score: 0 }]),
  }));
  const isArabicTranslation = form.locale === 'ar';
  const usesOptions = CHOICE_TYPES.has(form.type);
  const changeOption = (index, patch) => setForm({ ...form, options: form.options.map((option, i) => i === index ? { ...option, ...patch } : option) });
  const addOption = () => setForm((current) => {
    const usedValues = new Set(current.options.map((option) => option.value));
    let nextNumber = current.options.length + 1;
    while (usedValues.has(`option_${nextNumber}`)) nextNumber += 1;
    return { ...current, options: [...current.options, { label: '', value: `option_${nextNumber}`, score: 0 }] };
  });
  const removeOption = (index) => setForm({ ...form, options: form.options.filter((_, i) => i !== index) });
  const save = async () => {
    const data = { ...form, stepper: Number(stepperId || value?.stepper?.id || value?.stepper), options: usesOptions ? form.options.filter((option) => option.label.trim()).map((option) => ({ ...option, score: Number(option.score) || 0 })) : [] };
    const response = value?.id ? await put(`${API}/resources/questions/${value.id}`, { data }) : await post(`${API}/resources/questions`, { data });
    onSaved(response.data?.data || response.data);
  };
  return <Surface padding={5} hasRadius>
    <Flex justifyContent="space-between" alignItems="flex-start" gap={4}>
      <Box><Flex gap={2}><Typography variant="delta">{value ? 'Edit question' : 'New question'}</Typography><Badge>{form.locale === 'ar' ? 'العربية' : 'English'}</Badge></Flex><Muted>{isArabicTranslation ? 'Translate only the visitor-facing text. Logic, order and scoring stay synchronized with English.' : 'Saving creates the Arabic translation automatically with the same booking logic.'}</Muted></Box>
      <Button variant="tertiary" onClick={onCancel}>Close</Button>
    </Flex>
    <Grid.Root gap={4} marginTop={5}>
      <Grid.Item col={6} s={12}><Field.Root required><Field.Label>Question title</Field.Label><TextInput value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}/></Field.Root></Grid.Item>
      <Grid.Item col={3} s={6}><Field.Root hint="Managed automatically by Injaaz Cal"><Field.Label>Question ID</Field.Label><TextInput disabled value={form.key}/></Field.Root></Grid.Item>
      <Grid.Item col={3} s={6}><Field.Root><Field.Label>Language</Field.Label><SingleSelect disabled={Boolean(value?.id)} value={form.locale} onChange={nextLocale => setForm({ ...form, locale: nextLocale })}><SingleSelectOption value="en">English</SingleSelectOption><SingleSelectOption value="ar">العربية</SingleSelectOption></SingleSelect></Field.Root></Grid.Item>
      <Grid.Item col={3} s={6}><Field.Root><Field.Label>Answer type</Field.Label><SingleSelect disabled={isArabicTranslation} value={form.type} onChange={type => setForm({ ...form, type })}>{['radio','select','checkbox','text','textarea','email','phone','url','number'].map(type => <SingleSelectOption key={type} value={type}>{labelize(type)}</SingleSelectOption>)}</SingleSelect></Field.Root></Grid.Item>
      <Grid.Item col={3} s={6}><Field.Root hint="Fallback score for answered non-choice questions"><Field.Label>Question score</Field.Label><NumberInput disabled={isArabicTranslation} value={Number(form.weight) || 0} onValueChange={weight => setForm({ ...form, weight })}/></Field.Root></Grid.Item>
      <Grid.Item col={3} s={6}><Field.Root><Field.Label>Display order</Field.Label><NumberInput disabled={isArabicTranslation} value={Number(form.order) || 0} onValueChange={order => setForm({ ...form, order })}/></Field.Root></Grid.Item>
      <Grid.Item col={3} s={6}><Flex gap={4} paddingTop={5}><Toggle disabled={isArabicTranslation} checked={form.required !== false} onChange={e => setForm({ ...form, required: e.target.checked })} onLabel="Required" offLabel="Optional"/><Toggle disabled={isArabicTranslation} checked={form.active !== false} onChange={e => setForm({ ...form, active: e.target.checked })} onLabel="Active" offLabel="Paused"/></Flex></Grid.Item>
      <Grid.Item col={6} s={12}><Field.Root><Field.Label>Help text</Field.Label><TextInput value={form.helpText || ''} onChange={e => setForm({ ...form, helpText: e.target.value })}/></Field.Root></Grid.Item>
      <Grid.Item col={6} s={12}><Field.Root><Field.Label>Placeholder</Field.Label><TextInput value={form.placeholder || ''} onChange={e => setForm({ ...form, placeholder: e.target.value })}/></Field.Root></Grid.Item>
    </Grid.Root>
    {usesOptions ? <Box marginTop={6}>
      <Flex justifyContent="space-between" alignItems="center"><Box><Typography variant="delta">Answer options and scores</Typography><Muted>{isArabicTranslation ? 'Translate the option text only. Values and scores come from English.' : 'Each selected option contributes its own score to qualification.'}</Muted></Box><Button disabled={isArabicTranslation} variant="secondary" startIcon={<Plus/>} onClick={addOption}>Add option</Button></Flex>
      <Flex direction="column" alignItems="stretch" gap={3} marginTop={4}>{form.options.map((option, index) => <OptionRow key={index} gap={3} alignItems="end">
        <Grid.Item col={5} s={12}><Field.Root required><Field.Label>Option text</Field.Label><TextInput value={option.label} onChange={e => changeOption(index, { label: e.target.value })}/></Field.Root></Grid.Item>
        <Grid.Item col={4} s={7}><Field.Root required hint="Managed automatically as option_n"><Field.Label>Stored value</Field.Label><TextInput disabled value={option.value}/></Field.Root></Grid.Item>
        <Grid.Item col={2} s={3}><Field.Root><Field.Label>Score</Field.Label><NumberInput disabled={isArabicTranslation} value={Number(option.score) || 0} onValueChange={score => changeOption(index, { score })}/></Field.Root></Grid.Item>
        <Grid.Item col={1} s={2}><Button fullWidth variant="danger-light" aria-label={`Remove option ${index + 1}`} onClick={() => removeOption(index)} disabled={isArabicTranslation || form.options.length === 1}><Trash/></Button></Grid.Item>
      </OptionRow>)}</Flex>
    </Box> : <Box marginTop={6} padding={4} background="neutral100" hasRadius><Typography fontWeight="semiBold">No options needed for {labelize(form.type)} questions.</Typography><Muted>The respondent will enter a value directly. The question score is applied when an answer is provided.</Muted></Box>}
    <Button marginTop={6} onClick={save}>Save {form.locale === 'ar' ? 'Arabic' : 'English'} question</Button>
  </Surface>;
}

function NoteEditor({ onSaved, onCancel }) {
  const { post } = useFetchClient();
  const [form,setForm]=useState({lead:'',body:'',type:'general',createdByName:'Injaaz team'});
  const save=async()=>{const response=await post(`${API}/resources/notes`,{data:{...form,lead:Number(form.lead)}});onSaved(response.data?.data||response.data)};
  return <Surface padding={5} hasRadius><Typography variant="delta">Add lead note</Typography><Grid.Root gap={4} marginTop={4}><Grid.Item col={3} s={12}><Field.Root required><Field.Label>Lead ID</Field.Label><TextInput type="number" value={form.lead} onChange={e=>setForm({...form,lead:e.target.value})}/></Field.Root></Grid.Item><Grid.Item col={3} s={12}><Field.Root><Field.Label>Type</Field.Label><SingleSelect value={form.type} onChange={type=>setForm({...form,type})}>{['general','call_note','follow_up','proposal','decision'].map(type=><SingleSelectOption key={type} value={type}>{labelize(type)}</SingleSelectOption>)}</SingleSelect></Field.Root></Grid.Item><Grid.Item col={6} s={12}><Field.Root required><Field.Label>Note</Field.Label><Textarea value={form.body} onChange={e=>setForm({...form,body:e.target.value})}/></Field.Root></Grid.Item></Grid.Root><Flex gap={3} marginTop={4}><Button onClick={save}>Save note</Button><Button variant="tertiary" onClick={onCancel}>Cancel</Button></Flex></Surface>;
}

const DEFAULT_CONTACTS = {
  name: { visible: true, required: true }, email: { visible: true, required: true },
  phone: { visible: true, required: false }, companyName: { visible: true, required: false }, websiteUrl: { visible: true, required: false },
};

function StepperWorkspace() {
  const { get, post, put, del } = useFetchClient();
  const { toggleNotification } = useNotification();
  const [items, setItems] = useState([]); const [selected, setSelected] = useState(null); const [questions, setQuestions] = useState([]);
  const [locale, setLocale] = useState('en'); const [editingQuestion, setEditingQuestion] = useState(null); const [creatingQuestion, setCreatingQuestion] = useState(false);
  const [form, setForm] = useState(null);
  const load = async () => { const response = await get(`${API}/steppers`); const next = response.data?.data || response.data || []; setItems(next); if (selected) setSelected(next.find(item => item.id === selected.id) || null); };
  const loadQuestions = async () => { if (!selected) return; const response = await get(`${API}/resources/questions`, { params: { stepperId: selected.id, locale, pageSize: 100 } }); setQuestions(response.data?.data?.results || []); };
  useEffect(() => { load(); }, []);
  useEffect(() => { if (selected) setForm({ ...selected, contactFields: { ...DEFAULT_CONTACTS, ...(selected.contactFields || {}) } }); }, [selected?.id]);
  useEffect(() => { if (selected) loadQuestions(); }, [selected?.id, locale]);
  const maximumScore = questions.filter((question) => question.active !== false).reduce((total, question) => total + maximumQuestionScore(question), 0);
  const create = async () => { const response = await post(`${API}/steppers`, { data: { name: 'New booking stepper', key: `booking-stepper-${Date.now()}`, qualificationEnabled: false, qualificationThreshold: 0, contactFields: DEFAULT_CONTACTS } }); await load(); setSelected(response.data?.data || response.data); };
  const save = async () => { const response = await put(`${API}/steppers/${selected.id}`, { data: form }); setSelected(response.data?.data || response.data); await load(); toggleNotification({ type: 'success', message: 'Stepper draft saved.' }); };
  const action = async (name) => { try { let draft = form; if (name === 'publish' && form.qualificationEnabled !== false) { if (maximumScore <= 0) { toggleNotification({ type: 'danger', message: 'Add a positive score to at least one answer, or switch Qualification off.' }); return; } const threshold = Math.min(Math.max(0, Number(form.qualificationThreshold) || 0), maximumScore); if (threshold !== Number(form.qualificationThreshold)) { const saved = await put(`${API}/steppers/${selected.id}`, { data: { ...form, qualificationThreshold: threshold } }); draft = saved.data?.data || saved.data; setForm({ ...form, qualificationThreshold: threshold }); toggleNotification({ type: 'warning', message: `Threshold adjusted to the reachable maximum of ${maximumScore}.` }); } } const response = await post(`${API}/steppers/${selected.id}/${name}`); toggleNotification({ type: 'success', message: `Stepper ${name} complete.` }); setSelected(response.data?.data || response.data || draft); await load(); } catch (error) { const apiError = error.response?.data?.error; const details = apiError?.details; const context = details?.questionKey ? ` (${details.locale?.toUpperCase() || 'translation'}: ${details.questionKey})` : ''; const message = apiError?.code === 'STEPPER_THRESHOLD_UNREACHABLE' ? `Qualification threshold ${details?.qualificationThreshold} is above the maximum possible score ${details?.maximumScore}.` : apiError?.message || error.message; toggleNotification({ type: 'danger', message: `${message}${context}` }); } };
  const removeQuestion = async (question) => { if (!window.confirm(`Delete ${question.title}?`)) return; await del(`${API}/resources/questions/${question.id}`); loadQuestions(); };
  const reorderQuestions = async (draggedId, targetId) => {
    if (!draggedId || draggedId === targetId) return;
    const next = [...questions]; const from = next.findIndex(item => item.id === draggedId); const to = next.findIndex(item => item.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = next.splice(from, 1); next.splice(to, 0, moved); setQuestions(next.map((item, index) => ({ ...item, order: index + 1 })));
    await Promise.all(next.map((item, index) => put(`${API}/resources/questions/${item.id}`, { data: { order: index + 1 } })));
    loadQuestions();
  };
  if (!selected) return <Flex direction="column" alignItems="stretch" gap={5}>
    <Flex justifyContent="space-between" alignItems="flex-end"><Box><Flex gap={3}><Question/><Typography tag="h2" variant="alpha">Booking steppers</Typography></Flex><Muted>Reusable, translated qualification flows selected by each Book Call page.</Muted></Box><Button startIcon={<Plus/>} onClick={create}>New stepper</Button></Flex>
    <Grid.Root gap={4}>{items.map(item => <Grid.Item key={item.id} col={4} s={6} xs={12}><Surface padding={5} hasRadius><Flex justifyContent="space-between"><Badge>{labelize(item.status)}</Badge><Typography variant="sigma">v{item.version || 0}</Typography></Flex><Typography variant="delta" marginTop={3}>{item.name}</Typography><Muted>{item.description || item.key}</Muted><Flex gap={3} marginTop={4}><Badge>{item.questionCount || 0} questions</Badge><Badge>{item.qualificationEnabled === false ? 'No scoring' : `Threshold ${item.qualificationThreshold}`}</Badge></Flex><Button fullWidth marginTop={4} variant="secondary" onClick={() => setSelected(item)}>Open editor</Button></Surface></Grid.Item>)}</Grid.Root>
  </Flex>;
  if (!form) return <Flex padding={8} justifyContent="center"><Loader>Loading stepper editor</Loader></Flex>;
  const contactField = (key, label) => <Grid.Item col={4} s={6} xs={12}><Surface padding={4} hasRadius><Typography fontWeight="bold">{label}</Typography><Flex gap={4} marginTop={3}><Toggle disabled={['name','email'].includes(key)} checked={form.contactFields[key]?.visible !== false} onChange={e => setForm({ ...form, contactFields: { ...form.contactFields, [key]: { ...form.contactFields[key], visible: e.target.checked } } })} onLabel="Shown" offLabel="Hidden"/><Toggle disabled={['name','email'].includes(key)} checked={form.contactFields[key]?.required === true} onChange={e => setForm({ ...form, contactFields: { ...form.contactFields, [key]: { ...form.contactFields[key], required: e.target.checked } } })} onLabel="Required" offLabel="Optional"/></Flex></Surface></Grid.Item>;
  return <Flex direction="column" alignItems="stretch" gap={5}>
    <Flex justifyContent="space-between" alignItems="center" wrap="wrap" gap={3}><Button variant="tertiary" onClick={() => { setSelected(null); setForm(null); }}>← All steppers</Button><Flex gap={2}><Button variant="secondary" onClick={() => action('duplicate')}>Duplicate</Button><Button variant="danger-light" onClick={() => action('archive')}>Archive</Button><Button startIcon={<CheckCircle/>} onClick={() => action('publish')}>Publish version</Button></Flex></Flex>
    <Hero padding={6} hasRadius><Flex justifyContent="space-between" alignItems="flex-start"><Box><Badge>{labelize(form.status)} · VERSION {form.version || 0}</Badge><Typography variant="alpha" tag="h2" marginTop={3}>{form.name}</Typography><Muted>Draft changes stay private until you publish.</Muted></Box><Button onClick={save}>Save draft</Button></Flex></Hero>
    <Surface padding={5} hasRadius><Typography variant="delta">Basics and qualification</Typography><Grid.Root gap={4} marginTop={4}><Grid.Item col={4} s={12}><Field.Root required><Field.Label>Internal name</Field.Label><TextInput value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></Field.Root></Grid.Item><Grid.Item col={4} s={12}><Field.Root required><Field.Label>Stable key</Field.Label><TextInput value={form.key} onChange={e => setForm({ ...form, key: e.target.value })}/></Field.Root></Grid.Item><Grid.Item col={4} s={12}><Field.Root hint={`Maximum possible score: ${maximumScore}`}><Field.Label>Qualification threshold</Field.Label><NumberInput disabled={form.qualificationEnabled === false} value={Number(form.qualificationThreshold) || 0} onValueChange={qualificationThreshold => setForm({ ...form, qualificationThreshold: Math.max(0, Number(qualificationThreshold) || 0) })}/></Field.Root></Grid.Item><Grid.Item col={8} s={12}><Field.Root><Field.Label>Description</Field.Label><Textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })}/></Field.Root></Grid.Item><Grid.Item col={4} s={12}><Flex paddingTop={5}><Toggle checked={form.qualificationEnabled !== false} onChange={e => setForm({ ...form, qualificationEnabled: e.target.checked })} onLabel="Qualification on" offLabel="Collect only"/></Flex></Grid.Item></Grid.Root></Surface>
    <Box><Typography variant="delta">Contact step</Typography><Muted>Name and email are always shown and required. Configure the optional fields for this funnel.</Muted><Grid.Root gap={3} marginTop={4}>{contactField('name','Full name')}{contactField('email','Email')}{contactField('phone','Phone')}{contactField('companyName','Company')}{contactField('websiteUrl','Website')}</Grid.Root></Box>
    <Surface padding={5} hasRadius><Flex justifyContent="space-between" alignItems="center"><Box><Typography variant="delta">Questions</Typography><Muted>{locale === 'ar' ? 'Translate visitor-facing text. Question IDs, order and scoring are synchronized automatically.' : 'Create each question once; Injaaz Cal creates its Arabic translation automatically.'}</Muted></Box><Flex gap={3}><SingleSelect value={locale} onChange={nextLocale => { setLocale(nextLocale); setEditingQuestion(null); setCreatingQuestion(false); }}><SingleSelectOption value="en">English</SingleSelectOption><SingleSelectOption value="ar">العربية</SingleSelectOption></SingleSelect><Button disabled={locale === 'ar'} startIcon={<Plus/>} onClick={() => setCreatingQuestion(true)}>{locale === 'ar' ? 'Add in English' : 'Add question'}</Button></Flex></Flex>
      {(creatingQuestion || editingQuestion) ? <Box marginTop={5}><QuestionEditor value={editingQuestion} locale={locale} stepperId={selected.id} onCancel={() => { setCreatingQuestion(false); setEditingQuestion(null); }} onSaved={() => { setCreatingQuestion(false); setEditingQuestion(null); loadQuestions(); }}/></Box> : null}
      <Flex direction="column" alignItems="stretch" gap={2} marginTop={4}>{questions.map(question => <Surface key={question.id} padding={4} hasRadius draggable={locale === 'en'} onDragStart={event => { if (locale === 'en') event.dataTransfer.setData('text/plain', String(question.id)); }} onDragOver={event => { if (locale === 'en') event.preventDefault(); }} onDrop={event => { if (locale !== 'en') return; event.preventDefault(); reorderQuestions(Number(event.dataTransfer.getData('text/plain')), question.id); }}><Flex justifyContent="space-between" alignItems="center"><Flex gap={3}><Badge>{locale === 'en' ? '↕' : '•'} #{question.order}</Badge><Box><Typography fontWeight="bold">{question.title}</Typography><Muted>{question.key} · {labelize(question.type)} · score {question.weight || 0}</Muted></Box></Flex><Flex gap={2}><Button variant="tertiary" startIcon={<Pencil/>} onClick={() => setEditingQuestion(question)}>Edit</Button><Button variant="danger-light" onClick={() => removeQuestion(question)}><Trash/></Button></Flex></Flex></Surface>)}</Flex>
    </Surface>
  </Flex>;
}

function ResourceView({ resource }) {
  const config=resourceConfig[resource];const { get,put,del }=useFetchClient();const {toggleNotification}=useNotification();
  const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);const [search,setSearch]=useState('');const [editing,setEditing]=useState(null);const [creating,setCreating]=useState(false);const [locale,setLocale]=useState('en');
  const load=async()=>{setLoading(true);try{const response=await get(`${API}/resources/${resource}`,{params:{pageSize:50,search,...(resource==='questions'?{locale}:{})}});setItems(response.data?.data?.results||response.data?.results||[])}catch(error){toggleNotification({type:'danger',message:error.message})}finally{setLoading(false)}};
  useEffect(()=>{load()},[resource,locale]);
  const updateStatus=async(item,status)=>{await put(`${API}/resources/${resource}/${item.id}`,{data:{status}});load()};
  const remove=async(item)=>{if(!window.confirm(`Delete ${config.label.toLowerCase()} #${item.id}?`))return;await del(`${API}/resources/${resource}/${item.id}`);load()};
  const columns=useMemo(()=>({leads:['name','email','companyName','score','status'],meetings:['start','lead','status','duration'],notes:['lead','type','body','createdByName'],questions:['order','title','key','locale','type','weight','active'],responses:['lead','questionKey','answer','scoreValue','answeredAt'],sessions:['lead','currentStep','completed','expiresAt'],reservations:['leadId','start','state','providerSyncState','retryCount'],audits:['leadId','action','actor','createdAt']}[resource]||[]),[resource]);
  return <Flex direction="column" alignItems="stretch" gap={5}>
    {resource==='questions'&&(creating||editing)?<QuestionEditor value={editing} locale={locale} onCancel={()=>{setEditing(null);setCreating(false)}} onSaved={()=>{setEditing(null);setCreating(false);load()}}/>:null}
    {resource==='notes'&&creating?<NoteEditor onCancel={()=>setCreating(false)} onSaved={()=>{setCreating(false);load()}}/>:null}
    <Flex justifyContent="space-between" alignItems="flex-end" gap={4} wrap="wrap">
      <Box><Flex gap={3}><config.icon/><Typography tag="h2" variant="alpha">{config.label}</Typography></Flex><Muted>{config.description}</Muted></Box>
      <Flex gap={3}>{resource==='questions'?<SingleSelect value={locale} onChange={setLocale} aria-label="Question language"><SingleSelectOption value="en">English</SingleSelectOption><SingleSelectOption value="ar">العربية</SingleSelectOption></SingleSelect>:null}<SearchInput value={search} onChange={e=>setSearch(e.target.value)} onClear={()=>setSearch('')} onKeyDown={e=>e.key==='Enter'&&load()} placeholder="Search" aria-label={`Search ${config.label}`}/><Button variant="secondary" startIcon={<ArrowClockwise/>} onClick={load}>Refresh</Button>{config.editable?<Button startIcon={<Plus/>} onClick={()=>setCreating(true)}>Add {resource==='notes'?'note':locale==='ar'?'Arabic question':'English question'}</Button>:null}</Flex>
    </Flex>
    <Surface hasRadius><Table colCount={columns.length+1} rowCount={items.length}><Thead><Tr>{columns.map(column=><Th key={column}><Typography variant="sigma">{labelize(column)}</Typography></Th>)}<Th><Typography variant="sigma">Actions</Typography></Th></Tr></Thead><Tbody>{loading?<Tr><Td colSpan={columns.length+1}><Flex padding={7} justifyContent="center"><Loader>Loading</Loader></Flex></Td></Tr>:items.map(item=><Tr key={item.id}>{columns.map(column=><Td key={column}>{column==='status'&&config.status?<SingleSelect size="S" value={item.status} onChange={status=>updateStatus(item,status)}>{config.status.map(status=><SingleSelectOption key={status} value={status}>{labelize(status)}</SingleSelectOption>)}</SingleSelect>:column==='locale'?<Badge>{item.locale==='ar'?'العربية':'English'}</Badge>:<Typography>{column==='lead'?relationName(item[column]):column==='answer'||column==='options'?JSON.stringify(item[column]):column.includes('At')||column==='start'?item[column]?new Date(item[column]).toLocaleString():'—':typeof item[column]==='boolean'?(item[column]?'Yes':'No'):labelize(item[column])}</Typography>}</Td>)}<Td><Flex gap={2}>{resource==='questions'?<Button variant="tertiary" onClick={()=>setEditing(item)} startIcon={<Pencil/>}>Edit</Button>:null}{['questions','notes'].includes(resource)?<Button variant="danger-light" onClick={()=>remove(item)} startIcon={<Trash/>}>Delete</Button>:null}</Flex></Td></Tr>)}</Tbody></Table></Surface>
  </Flex>;
}

function CalendarSettings() {
  const { get, put } = useFetchClient();
  const { toggleNotification } = useNotification();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const normalizeWeek = (weeklyAvailability) => DEFAULT_WEEK.map((fallback) => ({ ...fallback, ...(Array.isArray(weeklyAvailability) ? weeklyAvailability.find((item) => item.day === fallback.day) : null) }));
  useEffect(() => { get(`${API}/settings`).then(response => { const value = response.data?.data || response.data || {}; setForm({ ...value, weeklyAvailability: normalizeWeek(value.weeklyAvailability) }); }); }, []);
  const changeDay = (index, patch) => setForm({ ...form, weeklyAvailability: form.weeklyAvailability.map((day, i) => i === index ? { ...day, ...patch } : day) });
  const save = async () => {
    const invalidDay = form.weeklyAvailability.find(day => day.enabled && (!day.startTime || !day.endTime || day.startTime >= day.endTime));
    if (invalidDay) { toggleNotification({ type: 'danger', message: `${labelize(invalidDay.day)} must have a start time before its end time.` }); return; }
    setSaving(true);
    try { const response = await put(`${API}/settings`, { data: form }); const value = response.data?.data || response.data; setForm({ ...value, weeklyAvailability: normalizeWeek(value.weeklyAvailability) }); toggleNotification({ type: 'success', message: 'Calendar settings saved.' }); }
    catch (error) { toggleNotification({ type: 'danger', message: error.message }); }
    finally { setSaving(false); }
  };
  if (!form) return <Flex padding={8} justifyContent="center"><Loader>Loading calendar settings</Loader></Flex>;
  return <Flex direction="column" alignItems="stretch" gap={6}>
    <Flex justifyContent="space-between" alignItems="flex-end"><Box><Flex gap={3}><Cog/><Typography tag="h2" variant="alpha">Calendar settings</Typography></Flex><Muted>Availability, meeting rhythm and Google Calendar behavior.</Muted></Box><Button onClick={save} loading={saving}>Save settings</Button></Flex>
    <Surface hasRadius>
      <Box padding={5}><Typography variant="delta">Weekly working hours</Typography><Muted>Toggle each day open or closed. Time controls are available only on open days.</Muted></Box>
      {form.weeklyAvailability.map((day, index) => <DayRow key={day.day} $enabled={day.enabled} gap={4} alignItems="center">
        <Grid.Item col={3} s={12}><Flex gap={3} alignItems="center"><Toggle aria-label={`${day.day} availability`} checked={day.enabled} onChange={e => changeDay(index, { enabled: e.target.checked })} onLabel="Open" offLabel="Closed"/><Box><Typography fontWeight="bold">{day.day[0].toUpperCase() + day.day.slice(1)}</Typography><Badge marginTop={1} backgroundColor={day.enabled ? 'success200' : 'neutral200'} textColor={day.enabled ? 'success700' : 'neutral700'}>{day.enabled ? 'Accepting bookings' : 'Closed all day'}</Badge></Box></Flex></Grid.Item>
        <Grid.Item col={4} s={6}><Field.Root><Field.Label>Opening time</Field.Label><TextInput type="time" disabled={!day.enabled} value={day.startTime} onChange={e => changeDay(index, { startTime: e.target.value })}/></Field.Root></Grid.Item>
        <Grid.Item col={4} s={6}><Field.Root><Field.Label>Closing time</Field.Label><TextInput type="time" disabled={!day.enabled} value={day.endTime} onChange={e => changeDay(index, { endTime: e.target.value })}/></Field.Root></Grid.Item>
      </DayRow>)}
    </Surface>
    <Surface padding={5} hasRadius><Typography variant="delta">Booking rhythm</Typography><Grid.Root gap={4} marginTop={4}>{[['slotDuration','Slot interval'],['meetingDuration','Meeting duration'],['bufferBefore','Buffer before'],['bufferAfter','Buffer after'],['minNoticeHours','Minimum notice (hours)'],['maxDaysAhead','Booking horizon (days)'],['maxBookingsPerDay','Daily booking limit']].map(([key,label]) => <Grid.Item key={key} col={3} s={6} xs={12}><Field.Root><Field.Label>{label}</Field.Label><NumberInput value={Number(form[key]) || 0} onValueChange={value => setForm({ ...form, [key]: value })}/></Field.Root></Grid.Item>)}</Grid.Root></Surface>
    <Surface padding={5} hasRadius><Typography variant="delta">Meeting and provider</Typography><Grid.Root gap={4} marginTop={4}><Grid.Item col={4} s={12}><Field.Root><Field.Label>Meeting title</Field.Label><TextInput value={form.meetingTitle || ''} onChange={e => setForm({ ...form, meetingTitle: e.target.value })}/></Field.Root></Grid.Item><Grid.Item col={4} s={12}><Field.Root><Field.Label>Timezone</Field.Label><TextInput value={form.timezone || ''} onChange={e => setForm({ ...form, timezone: e.target.value })}/></Field.Root></Grid.Item><Grid.Item col={4} s={12}><Field.Root><Field.Label>Google Calendar ID</Field.Label><TextInput value={form.googleCalendarId || 'primary'} onChange={e => setForm({ ...form, googleCalendarId: e.target.value })}/></Field.Root></Grid.Item><Grid.Item col={4} s={12}><Field.Root><Field.Label>Location</Field.Label><TextInput value={form.meetingLocation || ''} onChange={e => setForm({ ...form, meetingLocation: e.target.value })}/></Field.Root></Grid.Item><Grid.Item col={4} s={12}><Flex paddingTop={5}><Toggle checked={form.autoCreateGoogleMeet !== false} onChange={e => setForm({ ...form, autoCreateGoogleMeet: e.target.checked })} onLabel="Google Meet on" offLabel="Google Meet off"/></Flex></Grid.Item></Grid.Root></Surface>
  </Flex>;
}

export default function InjaazCalApp(){const [view,setView]=useState('dashboard');const entries=[['dashboard','Overview'],['steppers','Steppers'],...Object.entries(resourceConfig).map(([key,value])=>[key,value.label]),['settings','Calendar settings']];return <Layouts.Root><Page.Title>Injaaz Cal</Page.Title><Page.Main><Layouts.Header title="Injaaz Cal" subtitle="Private booking operations workspace"/><NavWrap paddingLeft={10} paddingRight={10}><Tabs.Root value={view} onValueChange={setView} variant="simple"><Tabs.List aria-label="Injaaz Cal sections">{entries.map(([key,label])=><Tabs.Trigger key={key} value={key}>{label}</Tabs.Trigger>)}</Tabs.List></Tabs.Root></NavWrap><Layouts.Content>{view==='dashboard'?<Dashboard onOpen={setView}/>:view==='steppers'?<StepperWorkspace/>:view==='settings'?<CalendarSettings/>:<ResourceView resource={view}/>}</Layouts.Content></Page.Main></Layouts.Root>}
