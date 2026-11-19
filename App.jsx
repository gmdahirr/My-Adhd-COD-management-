import React, { useState } from "react";

const VITALS_AUG29 = [
  { label:"HR",        value:"68 bpm",     ok:true  },
  { label:"Urinary",   value:"Clear",      ok:true  },
  { label:"Libido",    value:"Improved",   ok:true  },
  { label:"Sleep",     value:"Refractory", ok:false },
  { label:"OCD",       value:"Confirmed",  ok:false },
];
const VITALS_OCT14 = [
  { label:"ATX",        value:"Stopped",         ok:true  },
  { label:"Racing Thts",value:"Day + Night",      ok:false },
  { label:"SRT",        value:"Stopped Oct 15",   ok:true  },
  { label:"Mirtazapine",value:"Started 7.5mg",    ok:true  },
];
const VITALS_OCT28 = [
  { label:"Vyvanse",    value:"30mg — Day 7",     ok:true  },
  { label:"Sleep",      value:"Better w/o Mir",   ok:true  },
  { label:"Mirtazapine",value:"PRN only",         ok:true  },
  { label:"Review",     value:"Today",            ok:false },
];

const DIAGNOSES = [
  { label:"ADHD — Inattentive",            status:"confirmed" },
  { label:"OCD — Incompleteness Subtype",  status:"confirmed", note:"3 domains: bedtime ritual · food rules · perfectionism" },
  { label:"GAD",                           status:"confirmed" },
  { label:"Grief Response",                status:"active",   note:"Thawing since Oct 15 sertraline exit — grief therapy essential" },
  { label:"MDD",                           status:"ruled-out" },
  { label:"Bipolar Spectrum",              status:"ruled-out", note:"Phased sleep = OCD severity cycling" },
  { label:"Autism Spectrum",               status:"ruled-out" },
];

const OCD_DOMAINS = [
  { title:"Bedtime Ritual", icon:"🌙", color:"#4A9EBF",
    body:"Positional sequence + watch-check. Incompleteness not anxiety. Location-independent. PRIMARY INSOMNIA DRIVER. ERP targeting this domain is the definitive treatment." },
  { title:"Food Rules",     icon:"🍳", color:"#E8A838",
    body:"Egg white rejected boiled/fried. Acceptable only as red omelette. Cannot explain rationale. OCD sensory presentation rule." },
  { title:"Perfectionism",  icon:"🔍", color:"#8B7BA8",
    body:"Excessive research before decisions. Task paralysis until conditions feel complete. ADHD + OCD mutually reinforcing." },
];

const DRUGS = {
  SRT: { name:"Sertraline",    color:"#5B8A6F" },
  BUP: { name:"Bupropion XL",  color:"#E8A838" },
  ATX: { name:"Atomoxetine",   color:"#C0392B" },
  PRO: { name:"Propranolol",   color:"#8B7BA8" },
  FLV: { name:"Faverin IR",    color:"#4A9EBF" },
  VYV: { name:"Vyvanse",       color:"#E85D5D" },
  MIR: { name:"Mirtazapine",   color:"#7A9E7E" },
  MEL: { name:"Melatonin MR",  color:"#6B7FBF" },
  NAC: { name:"NAC",           color:"#7ABFBF" },
  ARI: { name:"Aripiprazole",  color:"#D4A055" },
  CON: { name:"Concerta",      color:"#E8A838" },
};

const FAILED_DRUGS = [
  { drug:"Alprazolam 2mg",       reason:"Self-tapered before consultation" },
  { drug:"Pregabalin 50mg BD",   reason:"Self-started, tapered off Jun 25" },
  { drug:"Sertraline 100mg",     reason:"Subtherapeutic for OCD. Blunting. Libido suppression. Stopped Oct 15." },
  { drug:"Propranolol",          reason:"Tremors not bothersome. Stopped Oct 1." },
  { drug:"Atomoxetine 25mg",     reason:"Zero executive improvement 12 weeks. Stopped Oct 13." },
  { drug:"Melatonin 3mg std",    reason:"Failed — onset only" },
  { drug:"Magnesium glycinate",  reason:"Failed" },
  { drug:"Trazodone",            reason:"Failed" },
  { drug:"Clonidine",            reason:"Failed" },
  { drug:"Quetiapine 12.5mg",   reason:"Morning hangover unacceptable. Parked." },
  { drug:"Doxepin",              reason:"Unavailable in Pakistan" },
  { drug:"Hydroxyzine",          reason:"Unavailable in Pakistan" },
];

const FAVERIN_SCHEDULE = [
  { date:"Sep 16–Oct 6",  dose:"50mg OD nocte",          detail:"9pm with food.",                              done:true,  active:false },
  { date:"Oct 7–13",      dose:"100mg/day",              detail:"50mg AM + 50mg nocte.",                       done:true,  active:false },
  { date:"Oct 14+",       dose:"150mg/day",              detail:"Current: 50mg evening (dinner) + 100mg at night (bedtime ~12:30am). Larger dose at night.", done:false, active:true  },
  { date:"After reassessment", dose:"200mg/day",         detail:"100mg evening + 100mg night — only if OCD plateaus with partial response and side effects tolerable. Not a hard ceiling.", done:false, active:false },
];

const SERTRALINE_TAPER = [
  { dates:"Jun 30–Aug 31",  dose:"100mg OD", done:true  },
  { dates:"Sep 1–15",       dose:"75mg OD",  done:true  },
  { dates:"Sep 16–28",      dose:"50mg OD",  done:true  },
  { dates:"Sep 29–Oct 14",  dose:"25mg OD",  done:true  },
  { dates:"Oct 15",         dose:"STOPPED",  done:true,  ceased:true },
];

const VYVANSE_PROTOCOL = [
  { date:"Oct 21",      dose:"30mg OD",  note:"Started. Market minimum.",                                        done:true,  active:false },
  { date:"Oct 21–Nov 11", dose:"30mg OD", note:"3 weeks, tolerated well, minor improvement only. He sleeps ~2h after taking it (misses early peak) — take at 7:30 on waking and stay up.", done:false, active:true },
  { date:"Next step",   dose:"50mg OD",  note:"40mg not sold in Pakistan. Go to 50mg only if: 30mg tolerated, HR <100, BP <140/90, still inadequate after a week of earlier dosing. Review at 1 week. Back to 30mg if HR>100, anxiety, or worse sleep.", done:false, active:false },
  { date:"If fails",    dose:"Concerta 18mg", note:"Switch if 50mg not tolerated or no benefit after 2 weeks. Finer steps (27/36/54mg).", done:false, active:false },
];

const OCT28_CHECKLIST = [
  { item:"Resting HR",              target:"Below 90 bpm. If above 100 — do not uptitrate yet." },
  { item:"BP",                      target:"Systolic below 140. Flag if elevated." },
  { item:"Sleep quality",           target:"Has Vyvanse week 1 disrupted sleep? Mirtazapine PRN used?" },
  { item:"Appetite",                target:"Significantly reduced? Weight loss concern?" },
  { item:"Anxiety level",           target:"GAD worsened? Pre-calculating conversations more?" },
  { item:"Executive function",      target:"Any initiation improvement? Starting tasks easier?" },
  { item:"Focus and attention",     target:"Conversations — still mentally elsewhere? Improvement?" },
  { item:"Racing thoughts",         target:"Reduced vs Oct 14 baseline?" },
  { item:"Passive SI",              target:"Grief thawing — character change? Ego-dystonic quality maintained?" },
  { item:"OCD bedtime ritual",      target:"Duration or intensity change vs Sep baseline?" },
  { item:"Urinary",                 target:"Any hesitancy — Vyvanse NE effect" },
];

const SLEEP_PROTOCOL = [
  { name:"Mirtazapine 7.5mg",  timing:"9pm",  line:1, status:"PRN ONLY",          color:"#7A9E7E",
    note:"Sleep improved without it — do not take nightly. PRN: take on any night Vyvanse disrupts sleep, or 2+ consecutive bad nights, or OCD cycling worsens. NEVER increase to 15mg." },
  { name:"Melatonin MR 5mg",   timing:"10pm", line:2, status:"CONTINUE NIGHTLY",  color:"#6B7FBF",
    note:"Continue regardless of sleep quality. Modified release — covers nocturnal waking window. Zero interactions, zero cognitive impact." },
  { name:"Olanzapine 2.5mg",   timing:"9pm",  line:3, status:"IF MIR FAILS",      color:"#8B7BA8",
    note:"Best alternative if mirtazapine fails on a bad night. D2 + H1 + 5HT2A. No CYP2D6 interaction. Do not go to mirtazapine 15mg — switch to this instead." },
  { name:"Amitriptyline 10mg", timing:"9pm",  line:4, status:"THIRD LINE",        color:"#BF7A9E",
    note:"CYP2D6 substrate — bupropion makes 10mg behave as 20–30mg. Use only if mirtazapine and olanzapine both fail." },
  { name:"Quetiapine 6.25mg",  timing:"9pm",  line:5, status:"PARKED",            color:"#3A3A5A",
    note:"12.5mg caused unacceptable hangover. Try half tablet (6.25mg) as absolute last resort." },
];

const OCD_DRUGS = [
  { drug:"Faverin 150mg BD",   verdict:"ACTIVE ✓",  color:"#4A9EBF",
    note:"Does NOT inhibit CYP2D6. Sigma-1 agonism. Sedating at night. 14 days in — therapeutic effect building." },
  { drug:"NAC 600mg BD",       verdict:"ACTIVE",    color:"#7ABFBF",
    note:"Glutamate modulation. Zero interactions. OTC Pakistan. Ongoing." },
  { drug:"Aripiprazole 2mg",   verdict:"DEC 2025",  color:"#D4A055",
    note:"OCD augmentation. CYP2D6 substrate — bupropion elevates, start 2mg not 2.5mg. Dec 2025 if Y-BOCS shows partial response." },
  { drug:"Clomipramine",       verdict:"AVOID",     color:"#C0392B",
    note:"Strongest OCD evidence — CYP2D6 substrate + bupropion = dangerously unpredictable levels." },
  { drug:"Fluoxetine",         verdict:"AVOID",     color:"#8B4A4A",
    note:"Strong CYP2D6 inhibitor — compounds bupropion. Activating — worsens insomnia." },
];

const CYP2D6_TABLE = [
  { drug:"Mirtazapine 7.5mg",   effect:"No significant CYP2D6",     action:"Safe — predictable",          ok:true  },
  { drug:"Faverin IR",          effect:"Does NOT inhibit CYP2D6",   action:"Key advantage over SSRIs",    ok:true  },
  { drug:"Vyvanse 30mg",        effect:"Partly CYP2D6-metabolised",  action:"Bupropion may raise exposure — go slow", ok:false },
  { drug:"Amitriptyline 10mg",  effect:"~20–30mg effective",        action:"Ceiling — do not increase",   ok:false },
  { drug:"Aripiprazole 2mg",    effect:"Behaves higher",            action:"Start 2mg not 2.5mg",         ok:false },
];

const VYV_VS_CON = [
  { param:"Mechanism",          vyvanse:"Releases DA + NE — new action", concerta:"Blocks DA + NE reuptake only" },
  { param:"Fit with bupropion", vyvanse:"Complementary — adds release",  concerta:"Overlapping — both block reuptake" },
  { param:"Executive initiation",vyvanse:"Superior",                     concerta:"Good" },
  { param:"Duration",           vyvanse:"12–14 hours",                   concerta:"10–12 hours" },
  { param:"Appetite effect",    vyvanse:"More pronounced",               concerta:"Less — advantage" },
  { param:"Sleep disruption",   vyvanse:"Higher risk",                   concerta:"Lower risk" },
  { param:"Pakistan supply",    vyvanse:"Limited — 30mg minimum",        concerta:"More available — 18mg" },
  { param:"Starting dose",      vyvanse:"30mg (market min) + BUP",       concerta:"18mg — cleaner start" },
  { param:"Ceiling with BUP",   vyvanse:"50mg+ (40mg unavailable)",                          concerta:"54mg" },
  { param:"Winner",             vyvanse:"✓ Pharmacologically",           concerta:"✓ Availability/tolerability" },
];

const ATX_VYV_REASONS = [
  "Both elevate NE simultaneously — noradrenergic overdrive",
  "ATX blocks NE reuptake + Vyvanse releases NE = cardiovascular risk without propranolol",
  "ATX showed zero benefit in 12 weeks — nothing to augment",
  "Unreadable signal — cannot assess Vyvanse through ATX noise",
  "Combination reserved for partial ATX responders only",
];

const DAILY_SCHEDULE = [
  { slot:"Morning", time:"7:30–8:30am, with breakfast", items:[
    { name:"Bupropion XL", dose:"300mg", color:"#E8A838" },
    { name:"Vyvanse", dose:"30mg", color:"#E85D5D" },
  ]},
  { slot:"Afternoon", time:"", items:[
    { name:"Vitamin D capsule", dose:"", color:"#9AA0B4" },
  ]},
  { slot:"Evening", time:"~7–8pm, with dinner", items:[
    { name:"Faverin", dose:"50mg", color:"#4A9EBF" },
    { name:"Vitrum capsule", dose:"", color:"#9AA0B4" },
  ]},
  { slot:"Night", time:"~12:30am, bedtime", items:[
    { name:"Faverin", dose:"100mg", color:"#4A9EBF", flag:"Entered as 'bupropion 100mg' — assumed Faverin 100mg. CONFIRM." },
    { name:"Mirtazapine", dose:"7.5mg", color:"#7A9E7E", flag:"Was PRN — confirm if now nightly." },
  ]},
];

const DAILY_NOT_LISTED = [
  "NAC 600mg BD — started Oct 1, not in today's list. Confirm if still taking.",
  "Melatonin MR 5mg — not in today's list. Advised to stop (fluvoxamine raises melatonin levels).",
];

const PHASES = [
  { id:"p1",  done:true,  dates:"Jun 8–14",      label:"Pregabalin Phase 1",
    meds:[{...DRUGS.SRT,dose:"100mg OD"},{...DRUGS.PRO,dose:"10mg BD"}], badge:null,
    notes:"Pregabalin 25mg AM + 50mg PM. Alprazolam ceased.", alert:null },
  { id:"p2",  done:true,  dates:"Jun 15–19",     label:"Pregabalin Phase 2",
    meds:[{...DRUGS.SRT,dose:"100mg OD"},{...DRUGS.PRO,dose:"10mg BD"}], badge:null,
    notes:"Pregabalin 25mg AM + 25mg PM.", alert:null },
  { id:"p3",  done:true,  dates:"Jun 20–24",     label:"Pregabalin Phase 3",
    meds:[{...DRUGS.SRT,dose:"100mg OD"},{...DRUGS.PRO,dose:"10mg BD"}], badge:null,
    notes:"Pregabalin 25mg PM only.", alert:null },
  { id:"p4",  done:true,  dates:"Jun 25",        label:"Pregabalin STOP",
    meds:[{...DRUGS.SRT,dose:"100mg OD"},{...DRUGS.PRO,dose:"10mg BD"}], badge:"CEASED",
    notes:"Pregabalin ceased. 5-day GABAergic clearance gap.", alert:"Watch: rebound anxiety, insomnia, tremor." },
  { id:"p5",  done:true,  dates:"Jun 25–29",     label:"GABAergic Clearance Gap",
    meds:[{...DRUGS.SRT,dose:"100mg OD"},{...DRUGS.PRO,dose:"10mg BD"}], badge:null,
    notes:"5-day observation. Baseline quiet.", alert:null },
  { id:"p6",  done:true,  dates:"Jun 30",        label:"Bupropion START",
    meds:[{...DRUGS.SRT,dose:"100mg OD"},{...DRUGS.BUP,dose:"150mg OD AM"},{...DRUGS.PRO,dose:"10mg BD"}], badge:"NEW",
    notes:"Patient on vacation. Transient activation days 1–7.", alert:"CYP2D6: Bupropion + Sertraline both inhibitors." },
  { id:"p7",  done:true,  dates:"Jun 30–Jul 18", label:"Bupropion Settling",
    meds:[{...DRUGS.SRT,dose:"100mg OD"},{...DRUGS.BUP,dose:"150mg OD"},{...DRUGS.PRO,dose:"10mg BD"}], badge:null,
    notes:"Tolerability, libido, blunting assessed at 2 weeks.", alert:null },
  { id:"p8",  done:true,  dates:"Jul 19",        label:"Atomoxetine START",
    meds:[{...DRUGS.SRT,dose:"100mg OD"},{...DRUGS.BUP,dose:"150mg OD"},{...DRUGS.ATX,dose:"25mg OD AM"},{...DRUGS.PRO,dose:"10mg BD"}], badge:"NEW",
    notes:"Baseline HR/BP documented. 25mg permanent — CYP2D6 stack makes it ~60–75mg.",
    alert:"DO NOT uptitrate. Monitor HR, BP, urinary." },
  { id:"p9",  done:true,  dates:"Aug 2",         label:"ATX 2-Week Review",
    meds:[{...DRUGS.SRT,dose:"100mg OD"},{...DRUGS.BUP,dose:"150mg OD"},{...DRUGS.ATX,dose:"25mg OD"},{...DRUGS.PRO,dose:"10mg BD"}], badge:null,
    notes:"HR, BP, urinary, mood, appetite, insomnia, tremor. Passive SI.", alert:"HR below 55 → reduce Propranolol." },
  { id:"p10", done:true,  dates:"Aug 19",        label:"First Comprehensive Review",
    meds:[{...DRUGS.SRT,dose:"100mg OD"},{...DRUGS.BUP,dose:"150mg OD"},{...DRUGS.ATX,dose:"25mg OD"},{...DRUGS.PRO,dose:"10mg BD"}], badge:null,
    notes:"Full stack review.", alert:null },
  { id:"p11", done:true,  dates:"Aug 29",        label:"OCD Confirmed",
    meds:[{...DRUGS.SRT,dose:"100mg OD"},{...DRUGS.BUP,dose:"150mg OD"},{...DRUGS.ATX,dose:"25mg OD"},{...DRUGS.PRO,dose:"10mg BD"}], badge:null,
    notes:"OCD confirmed across 3 domains. Not-just-right subtype. MDD, Bipolar, Autism ruled out. Sleep refractory — failed multiple agents.", alert:"ATX tremor worsening since Jul 19 = NRI-driven." },
  { id:"p12", done:true,  dates:"Sep 1–15",      label:"SRT Taper Step 1 + PRO Reduction",
    meds:[{...DRUGS.SRT,dose:"75mg OD ↓",taper:true},{...DRUGS.BUP,dose:"150mg OD"},{...DRUGS.ATX,dose:"25mg OD"},{...DRUGS.PRO,dose:"10mg OD ↓",taper:true}], badge:"TAPERING",
    notes:"SRT 100→75mg. PRO 10mg BD→OD. Y-BOCS administered. ERP referral initiated.", alert:"Monitor passive SI." },
  { id:"p13", done:true,  dates:"Sep 16–28",     label:"Faverin START + SRT Step 2",
    meds:[{...DRUGS.SRT,dose:"50mg OD ↓",taper:true},{...DRUGS.BUP,dose:"150mg OD"},{...DRUGS.ATX,dose:"25mg OD"},{...DRUGS.PRO,dose:"10mg OD"},{...DRUGS.FLV,dose:"50mg nocte",isNew:true}], badge:"NEW",
    notes:"Faverin 50mg nocte 9pm with food. SRT 75→50mg. Sep 17: no executive change (expected), social withdrawal, fog mild improvement.", alert:"Hold Faverin 50mg until SRT ≤25mg." },
  { id:"p14", done:true,  dates:"Sep 29–Oct 6",  label:"SRT Taper Step 3",
    meds:[{...DRUGS.SRT,dose:"25mg OD ↓",taper:true},{...DRUGS.BUP,dose:"150mg OD"},{...DRUGS.ATX,dose:"25mg OD"},{...DRUGS.PRO,dose:"10mg OD"},{...DRUGS.FLV,dose:"50mg nocte"}], badge:"TAPERING",
    notes:"SRT → 25mg. Brain zaps, flu-like expected — transient.", alert:null },
  { id:"p15", done:true,  dates:"Oct 1",         label:"Sleep Protocol + NAC + PRO Stopped",
    meds:[{...DRUGS.SRT,dose:"25mg OD"},{...DRUGS.BUP,dose:"300mg XL AM"},{...DRUGS.ATX,dose:"25mg OD"},{...DRUGS.FLV,dose:"50mg nocte"},{...DRUGS.MEL,dose:"5mg MR",isNew:true},{...DRUGS.NAC,dose:"600mg BD",isNew:true}], badge:"DECISION",
    notes:"Propranolol stopped — tremors not bothersome. Melatonin MR 5mg started. NAC 600mg BD started.", alert:"No benzos or Z-drugs ever." },
  { id:"p16", done:true,  dates:"Oct 7–12",      label:"Faverin → 100mg BD",
    meds:[{...DRUGS.SRT,dose:"25mg OD"},{...DRUGS.BUP,dose:"300mg XL AM"},{...DRUGS.ATX,dose:"25mg OD"},{...DRUGS.FLV,dose:"50mg AM + 50mg nocte ↑",upgrade:true},{...DRUGS.MEL,dose:"5mg MR"},{...DRUGS.NAC,dose:"600mg BD"}], badge:"TAPERING",
    notes:"Faverin 50mg AM + 50mg nocte. First OCD signal — bedtime ritual vs Sep baseline.", alert:null },
  { id:"p17", done:true,  dates:"Oct 13–14",     label:"ATX STOP + Faverin → 150mg + Mirtazapine START",
    meds:[{...DRUGS.ATX,dose:"STOPPED",ceased:true},{...DRUGS.BUP,dose:"300mg XL AM"},{...DRUGS.FLV,dose:"50mg eve + 100mg night ↑",upgrade:true},{...DRUGS.MIR,dose:"7.5mg 9pm",isNew:true},{...DRUGS.MEL,dose:"5mg MR"},{...DRUGS.NAC,dose:"600mg BD"}], badge:"DECISION",
    notes:"Oct 13: ATX stopped — 12 weeks, 90% confidence failure. No taper needed (5hr half-life).\nOct 14: Faverin → 150mg BD (50mg eve + 100mg night). Early upgrade — racing thoughts day + night needed therapeutic Faverin dose sooner.\nOct 14: Mirtazapine 7.5mg nocte first proper trial. 9pm with food.\n\nOct 20: Patient sleeping well WITHOUT mirtazapine after 2 nights. Decision → mirtazapine switched to PRN. Vyvanse starting Oct 21 approved.",
    alert:"Highest passive SI risk — ATX stopped, SRT stopping, no ADHD medication, grief thawing. Ask at every contact." },
  { id:"p18", done:true,  dates:"Oct 15",        label:"Sertraline STOP",
    meds:[{...DRUGS.SRT,dose:"STOPPED",ceased:true},{...DRUGS.BUP,dose:"300mg XL AM"},{...DRUGS.FLV,dose:"50mg eve + 100mg night"},{...DRUGS.MIR,dose:"7.5mg PRN"},{...DRUGS.MEL,dose:"5mg MR"},{...DRUGS.NAC,dose:"600mg BD"}], badge:"DECISION",
    notes:"Sertraline stopped. CYP2D6 now bupropion alone. Grief thawing begins — warn patient, grief therapy essential.",
    alert:"Grief surfacing is therapeutic not relapse. Monitor SI closely." },
  { id:"p19", done:true,  dates:"Oct 20",        label:"Mirtazapine → PRN + Vyvanse Approved",
    meds:[{...DRUGS.BUP,dose:"300mg XL AM"},{...DRUGS.FLV,dose:"50mg eve + 100mg night"},{...DRUGS.MIR,dose:"7.5mg PRN",taper:true},{...DRUGS.MEL,dose:"5mg MR"},{...DRUGS.NAC,dose:"600mg BD"}], badge:"DECISION",
    notes:"Patient sleeping well without mirtazapine after 2 nights — switched to PRN.\nMirtazapine PRN rules: take on any Vyvanse-disrupted night, 2+ consecutive bad nights, OCD cycling worsening.\nVyvanse approved to start Oct 21 — washout complete, sleep objection resolved.",
    alert:"Pharmacological washout complete: ATX cleared 7 days, SRT cleared 5 days. CYP2D6 = bupropion alone. Clean baseline." },
  { id:"p20", done:true,  dates:"Oct 21–27",     label:"Vyvanse 30mg — Week 1",
    meds:[{...DRUGS.VYV,dose:"30mg OD AM",isNew:true},{...DRUGS.BUP,dose:"300mg XL AM"},{...DRUGS.FLV,dose:"50mg eve + 100mg night"},{...DRUGS.MIR,dose:"7.5mg PRN"},{...DRUGS.MEL,dose:"5mg MR"},{...DRUGS.NAC,dose:"600mg BD"}], badge:"NEW",
    notes:"Vyvanse 30mg OD at 7:30–8:30am with breakfast (stay up after taking it). Market minimum available dose.\n30mg + bupropion 300mg XL = effective ~40–45mg equivalent in bupropion-free patient.\nWorking cap 40mg for now — reassess with HR/BP data.\nCounselled: days 1–3 activation, HR elevation, appetite reduction, possible sleep disruption — all transient and expected by day 5–7.\nMirtazapine available PRN for any disrupted night this week.",
    alert:"30mg with bupropion running = pharmacodynamic equivalent ~40–45mg. Monitor HR, BP, anxiety, sleep. First review Oct 28." },

  // ── ACTIVE ──
  { id:"p21", done:false, active:true, dates:"Oct 28 — TODAY", label:"Vyvanse Week 1 Review — ACTIVE",
    meds:[{...DRUGS.VYV,dose:"30mg OD"},{...DRUGS.BUP,dose:"300mg XL AM"},{...DRUGS.FLV,dose:"50mg eve + 100mg night"},{...DRUGS.MIR,dose:"7.5mg PRN"},{...DRUGS.MEL,dose:"5mg MR"},{...DRUGS.NAC,dose:"600mg BD"}], badge:"DECISION",
    notes:"REVIEW CHECKLIST — assess all parameters today:\n\n• HR — target below 90. Above 100 = do not uptitrate\n• BP — systolic below 140\n• Sleep — Vyvanse disruption? Mirtazapine PRN used?\n• Appetite — significant suppression? Weight concern?\n• Anxiety — GAD worsening?\n• Executive function — initiation improvement?\n• Focus — conversations, mental absence?\n• Racing thoughts — reduced vs Oct 14 baseline?\n• Passive SI — grief thawing, character change?\n• OCD bedtime ritual — duration change vs Sep baseline?\n• Urinary — any hesitancy?\n\nDECISION TREE:\nAdequate response at 30mg → continue 30mg, review Nov 11\nPartial response, tolerated → stay 30mg, reassess Nov 11\nPartial/no response + tolerated 3+ wks → 50mg (40mg unavailable), HR/BP first, review at 1 week\nIntolerable side effects → switch to Concerta 18mg\nHR above 100 → do not uptitrate until normalised",
    alert:"30mg is not the ceiling — 50mg is the next available step (40mg unavailable). But do not uptitrate if HR elevated or anxiety significant. Concerta 18mg is the exit route if Vyvanse fails." },

  // ── UPCOMING ──
  { id:"p22", done:false, dates:"Nov 11",         label:"Vyvanse Response Assessment",
    meds:[{...DRUGS.VYV,dose:"30–50mg OD"},{...DRUGS.BUP,dose:"300mg XL AM"},{...DRUGS.FLV,dose:"50mg eve + 100mg night"},{...DRUGS.MIR,dose:"7.5mg PRN"},{...DRUGS.MEL,dose:"5mg MR PRN"},{...DRUGS.NAC,dose:"600mg BD"}], badge:"DECISION",
    notes:"3-week Vyvanse assessment.\nIf 30mg adequate: continue, no change.\nIf 30mg inadequate but tolerated: increase to 50mg OD (40mg unavailable).\nIf 40mg needed: first review at 2 weeks after uptitration.\nIf sleep normalised: consider stepping down melatonin MR.", alert:null },

  { id:"p23", done:false, dates:"Dec 2025",        label:"Full OCD Response Assessment",
    meds:[{...DRUGS.VYV,dose:"30–50mg OD"},{...DRUGS.BUP,dose:"300mg XL AM"},{...DRUGS.FLV,dose:"50mg eve + 100mg night"},{...DRUGS.NAC,dose:"600mg BD"},{...DRUGS.ARI,dose:"2mg OD",isNew:true}], badge:"DECISION",
    notes:"Y-BOCS repeat — compare against Sep baseline.\nERP all 3 domains: perfectionism first, food rules second, bedtime ritual last.\n\nIF OCD CONFIRMED:\n• Faverin minimum 12 months\n• Aripiprazole 2mg OD — start 2mg not 2.5mg (CYP2D6 elevation by bupropion)\n\nIF OCD MISDIAGNOSED (no Y-BOCS improvement):\n• Taper Faverin: 150mg → 100mg 2wks → 50mg nocte 2wks → stop\n• Zero ADHD treatment impact\n• Vyvanse may need 5mg uptitration after Faverin clears",
    alert:"Aripiprazole: 2mg not 2.5mg — bupropion elevates CYP2D6 substrate levels." },

  { id:"p24", done:false, dates:"Jan 2026",        label:"Full Stability Review",
    meds:[{...DRUGS.VYV,dose:"30–50mg OD"},{...DRUGS.BUP,dose:"→ taper"},{...DRUGS.FLV,dose:"50mg eve + 100mg night"}], badge:null,
    notes:"ADHD controlled + OCD remission + mood stable → bupropion taper discussion.\nBupropion: 300mg → 150mg 4wks → 150mg alternate days 2wks → stop.\nFaverin: 12–24 months minimum if OCD confirmed.\nMirtazapine: discontinue if sleep consistently normal.\nMelatonin MR: discontinue if sleep normalised.\nStability is the prerequisite — not the calendar date.", alert:null },
];

const TAPER_SCHEDULE = [
  { drug:"Sertraline",   color:"#5B8A6F", steps:[
    { dates:"Jun 30–Aug 31",  dose:"100mg OD",              done:true  },
    { dates:"Sep 1–15",       dose:"75mg OD",               done:true  },
    { dates:"Sep 16–28",      dose:"50mg OD",               done:true  },
    { dates:"Sep 29–Oct 14",  dose:"25mg OD",               done:true  },
    { dates:"Oct 15",         dose:"STOPPED",  ceased:true, done:true  },
  ]},
  { drug:"Faverin IR",   color:"#4A9EBF", steps:[
    { dates:"Sep 16–Oct 6",   dose:"50mg OD nocte",         note:"Done",            done:true  },
    { dates:"Oct 7–13",       dose:"50mg AM + 50mg nocte",  note:"100mg BD — done", done:true  },
    { dates:"Oct 14+",        dose:"50mg eve + 100mg night", note:"150mg BD — active", active:true },
    { dates:"Jan 2026+",      dose:"100mg AM + 100mg nocte",note:"200mg ceiling"    },
  ]},
  { drug:"Propranolol",  color:"#8B7BA8", steps:[
    { dates:"Oct 1",          dose:"STOPPED",  ceased:true, note:"Tremors not bothersome", done:true },
  ]},
  { drug:"Atomoxetine",  color:"#C0392B", steps:[
    { dates:"Jul 19–Oct 12",  dose:"25mg OD AM",            note:"~60–75mg effective due to CYP2D6", done:true },
    { dates:"Oct 13",         dose:"STOPPED",  ceased:true, note:"Zero benefit 12 weeks", done:true },
  ]},
  { drug:"Bupropion XL", color:"#E8A838", steps:[
    { dates:"Jun 30–Sep 30",  dose:"150mg OD AM",           done:true  },
    { dates:"Oct 1+",         dose:"300mg XL AM",           note:"Single morning — confirmed", active:true },
  ]},
  { drug:"Vyvanse",      color:"#E85D5D", steps:[
    { dates:"Oct 21+",        dose:"30mg OD AM",            note:"Market minimum. BUP = ~40–45mg equivalent", active:true },
    { dates:"Nov 11+",        dose:"→ 50mg OD",             note:"40mg not sold in Pakistan — 50mg only if 30mg tolerated and still inadequate. HR/BP first, review at 1 week." },
    { dates:"If fails",       dose:"Concerta 18mg",         note:"Switch if 50mg not tolerated or no benefit" },
  ]},
  { drug:"Mirtazapine",  color:"#7A9E7E", steps:[
    { dates:"Oct 14–19",      dose:"7.5mg nocte",           note:"2 nights — sleep improved without it", done:true },
    { dates:"Oct 20+",        dose:"7.5mg PRN",             note:"Bad nights only / Vyvanse disruption", active:true },
    { dates:"Jan 2026",       dose:"Discontinue",  ceased:true, note:"If sleep consistently normal" },
  ]},
  { drug:"NAC",          color:"#7ABFBF", steps:[
    { dates:"Oct 1+",         dose:"600mg BD",              note:"OCD augmentation — continue", active:true },
    { dates:"Dec 2025",       dose:"Review",                note:"Assess alongside Y-BOCS" },
  ]},
  { drug:"Melatonin MR", color:"#6B7FBF", steps:[
    { dates:"Oct 1+",         dose:"5mg nocte 10pm",        note:"Continue nightly — zero risk", active:true },
    { dates:"Nov 11+",        dose:"Reassess",              note:"Step down if sleep consistently normal" },
  ]},
];

const ALERTS = [
  { label:"Oct 28 — Vyvanse Week 1 Review Due TODAY",   color:"#E85D5D",
    text:"Check: HR (target <90, do not uptitrate if >100), BP, sleep disruption, appetite, anxiety, executive function improvement, focus, racing thoughts vs Oct 14, passive SI, OCD ritual change, urinary hesitancy. Decision: continue 30mg / uptitrate to 40mg / switch to Concerta 18mg." },
  { label:"Passive SI — Monitor At Every Contact",      color:"#E07070",
    text:"Grief thawing since Oct 15. ATX stopped. Stimulant just started. Character of passive thoughts? Ego-dystonic quality maintained? Any active ideation? Do not skip this assessment." },
  { label:"Mirtazapine — PRN Rules",                   color:"#7A9E7E",
    text:"Do NOT take nightly — sleep improved without it. PRN: (1) Any Vyvanse-disrupted night this week. (2) 2+ consecutive bad nights. (3) OCD cycling worsens. NEVER increase to 15mg — switch to olanzapine 2.5mg if mirtazapine fails." },
  { label:"Vyvanse 30mg + Bupropion 300mg XL",         color:"#E85D5D",
    text:"Pharmacodynamic interaction — additive DA/NE. 30mg Vyvanse behaves as ~40–45mg in bupropion-free patient. 40mg is not sold in Pakistan. 50mg is the next step (40mg not sold) if 30mg is tolerated with partial response — check HR/BP, review at 1 week. Concerta 18mg is the exit route if Vyvanse fails." },
  { label:"ATX + Vyvanse — Never Together",            color:"#E07070",
    text:"Both elevate NE simultaneously. Additive noradrenergic overdrive. ATX showed zero benefit — nothing to augment. Combination reserved for partial ATX responders only. ATX stopped Oct 13, washout complete." },
  { label:"OCD Bedtime Ritual = Insomnia Driver",      color:"#4A9EBF",
    text:"Pharmacological agents reduce OCD drive. ERP extinguishes the ritual. Both required. ERP sequence: (1) Perfectionism. (2) Food rules. (3) Bedtime ritual — last and most entrenched." },
  { label:"CYP2D6 — Bupropion Strong Inhibitor",      color:"#D4A055",
    text:"Mirtazapine and Vyvanse have no significant CYP2D6 interaction — safe. Faverin does not inhibit CYP2D6 — correct choice. Amitriptyline 10mg = 20–30mg effective. Aripiprazole: start 2mg not 2.5mg." },
  { label:"Grief — Thawing Since Oct 15",             color:"#D4A055",
    text:"Sertraline suppressed grief processing. Authentic surfacing is therapeutic not relapse. Grief therapy is non-negotiable — it is the primary intervention for this component. Patient must have a therapeutic container before grief peaks." },
  { label:"Faverin — Why Chosen Over All Others",     color:"#4A9EBF",
    text:"Does NOT inhibit CYP2D6 — critical with bupropion running. Sigma-1 agonism adds anxiolytic depth. Sedating — helps insomnia. Clomipramine stronger OCD evidence but CYP2D6 dangerous. Fluoxetine strong CYP2D6 inhibitor — wrong." },
  { label:"No Benzos / Z-Drugs — Lifetime",          color:"#E07070",
    text:"Absolute contraindication. Alprazolam tapered. Mirtazapine is the safe alternative — H1, not GABAergic." },
  { label:"ERP — Mandatory",                         color:"#4A9EBF",
    text:"(1) Perfectionism first. (2) Food rules second. (3) Bedtime ritual last. Target nocturnal waking: time-checking, phone, mental review = compulsions. Digital ERP available if local therapist unavailable in RYK." },
];

const DECISIONS = [
  { date:"Oct 13",    text:"Atomoxetine STOPPED — 12 weeks, zero benefit.",                                                color:"#C0392B" },
  { date:"Oct 14",    text:"Faverin → 150mg BD. Mirtazapine 7.5mg first proper trial.",                                   color:"#4A9EBF" },
  { date:"Oct 15",    text:"Sertraline STOPPED. Grief thawing begins.",                                                    color:"#5B8A6F" },
  { date:"Oct 20",    text:"Mirtazapine → PRN. Sleep good without it. Vyvanse approved.",                                  color:"#7A9E7E" },
  { date:"Oct 21",    text:"Vyvanse 30mg OD started. Market minimum. ~40–45mg equivalent with bupropion.",                 color:"#E85D5D" },
  { date:"Oct 28 ★",  text:"VYVANSE WEEK 1 REVIEW — TODAY. HR, BP, sleep, focus, anxiety, SI. Continue/uptitrate/switch.", color:"#E07070" },
  { date:"Nov 11",    text:"Vyvanse 3-week assessment. Uptitrate to 50mg if needed (40mg unavailable).",                            color:"#E85D5D" },
  { date:"Dec 2025",  text:"Y-BOCS repeat. OCD verdict. Aripiprazole 2mg if partial response.",                           color:"#6B7A99" },
  { date:"Jan 2026",  text:"Stability review. Bupropion taper. Sleep agents discontinue if normalised.",                  color:"#5B5B6B" },
];

const BADGE_STYLES = {
  NEW:         { bg:"#1A2A1A", color:"#5B8A6F", border:"#2A4A2A" },
  CEASED:      { bg:"#2A1010", color:"#E07070", border:"#4A1A1A" },
  TAPERING:    { bg:"#1A1500", color:"#D4A055", border:"#3A3000" },
  DECISION:    { bg:"#1A1020", color:"#B07AD4", border:"#3A2050" },
  CONDITIONAL: { bg:"#1A1000", color:"#D4A055", border:"#4A3000" },
};

function Badge({ type }) {
  if (!type) return null;
  const s = BADGE_STYLES[type] || {};
  return <span style={{ fontSize:9, background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:4, padding:"1px 6px", fontWeight:800, letterSpacing:"0.08em" }}>{type}</span>;
}

function MedPill({ med }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4, background:`${med.color}15`, border:`1px solid ${med.color}38`, borderRadius:6, padding:"3px 8px", opacity:med.ceased?0.5:1, textDecoration:med.ceased?"line-through":"none" }}>
      <div style={{ width:5, height:5, borderRadius:"50%", background:med.color, flexShrink:0 }} />
      <span style={{ fontSize:11, color:med.color, fontWeight:700 }}>{med.name}</span>
      <span style={{ fontSize:11, color:med.upgrade?"#A0D060":"#9AA0B4", fontWeight:med.upgrade?700:400 }}>{med.dose}</span>
      {med.taper   && <span style={{ fontSize:9, color:"#D4A055" }}>↓</span>}
      {med.upgrade && <span style={{ fontSize:9, color:"#A0D060" }}>↑</span>}
    </div>
  );
}

const statusColors = {
  confirmed:   { bg:"#1A2A1A", color:"#5B8A6F", border:"#2A4A2A", dot:"#5B8A6F", label:"CONFIRMED"  },
  active:      { bg:"#1A1500", color:"#D4A055", border:"#3A3000", dot:"#D4A055", label:"ACTIVE"      },
  "ruled-out": { bg:"#1A1A2A", color:"#6B7A99", border:"#2A2A3A", dot:"#3A3A5A", label:"RULED OUT"  },
};

const Card = ({ children, style={} }) => (
  <div style={{ background:"#1A1D27", border:"1px solid #2A2D3A", borderRadius:10, padding:"12px 14px", marginBottom:10, ...style }}>
    {children}
  </div>
);

const ST = ({ label, color="#6B7A99" }) => (
  <div style={{ fontSize:9, color, textTransform:"uppercase", letterSpacing:"0.14em", fontWeight:700, marginBottom:10 }}>{label}</div>
);

export default function PatientTracker() {
  const [checked, setChecked]   = useState(() => { const d={}; PHASES.forEach(p=>{ if(p.done) d[p.id]=true; }); return d; });
  const [expanded, setExpanded] = useState({});
  const [tab, setTab]           = useState("summary");

  const toggle    = id => setChecked(p => ({ ...p, [id]: !p[id] }));
  const toggleExp = id => setExpanded(p => ({ ...p, [id]: !p[id] }));
  const completedCount = Object.values(checked).filter(Boolean).length;

  const SummaryTab = () => (
    <div>
      {/* DAILY SCHEDULE */}
      <Card style={{ background:"#0A1218", border:"1px solid #1A3A4A" }}>
        <ST label="Daily Medication Schedule — Updated Oct 28" color="#4A9EBF" />
        {DAILY_SCHEDULE.map((d,i) => (
          <div key={i} style={{ padding:"7px 0", borderBottom:i<DAILY_SCHEDULE.length-1?"1px solid #1A2A35":"none" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:12, fontWeight:700, color:"#C8CAD4" }}>{d.slot}</span>
              <span style={{ fontSize:10, color:"#6B7A99" }}>{d.time}</span>
            </div>
            {d.items.map((it,j) => (
              <div key={j} style={{ marginLeft:8, marginBottom:3 }}>
                <span style={{ fontSize:12, color:it.color, fontWeight:600 }}>{it.name}</span>
                {it.dose && <span style={{ fontSize:12, color:"#9AA0B4", marginLeft:6 }}>{it.dose}</span>}
                {it.flag && <div style={{ fontSize:10, color:"#D4A055", marginTop:1 }}>⚠ {it.flag}</div>}
              </div>
            ))}
          </div>
        ))}
        <div style={{ marginTop:8, padding:"6px 10px", background:"#120E08", border:"1px solid #3A2A10", borderRadius:7 }}>
          {DAILY_NOT_LISTED.map((n,i) => <div key={i} style={{ fontSize:10, color:"#D4A055", marginBottom:2 }}>• {n}</div>)}
          <div style={{ fontSize:10, color:"#9AA0B4", marginTop:4 }}>Totals: Faverin 150mg/day · Bupropion 300mg/day (if night dose is Faverin). He sleeps ~1am–7:30am plus ~2h after morning tablets — stay up after taking Vyvanse if possible.</div>
        </div>
      </Card>

      {/* TODAY ALERT */}
      <div style={{ background:"#1A0A0A", border:"2px solid #E85D5D", borderRadius:10, padding:"12px 14px", marginBottom:12 }}>
        <div style={{ fontSize:10, color:"#E85D5D", fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6 }}>★ Today — Oct 28 — Vyvanse Week 1 Review</div>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          {OCT28_CHECKLIST.map((c,i) => (
            <div key={i} style={{ display:"flex", gap:10, padding:"4px 0", borderBottom:i<OCT28_CHECKLIST.length-1?"1px solid #2A1010":"none" }}>
              <span style={{ fontSize:11, color:"#E85D5D", minWidth:110, fontWeight:600, flexShrink:0 }}>{c.item}</span>
              <span style={{ fontSize:11, color:"#9AA0B4" }}>{c.target}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vyvanse protocol */}
      <Card style={{ background:"#0A0A1A", border:"1px solid #2A1A3A" }}>
        <ST label="Vyvanse — Dosing Protocol" color="#E85D5D" />
        {VYVANSE_PROTOCOL.map((v,i) => (
          <div key={i} style={{ padding:"6px 8px", background:v.active?"#1A0A1A":v.done?"#0A0A15":"transparent", border:v.active?"1px solid #5A1A5A":v.done?"1px solid #1A1A2A":"1px solid transparent", borderRadius:7, marginBottom:4 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:10, color:v.active?"#E85D5D":v.done?"#6B7A99":"#6B7A99", fontWeight:v.active?700:400 }}>{v.date}</span>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:12, fontWeight:700, color:v.active?"#FF8080":v.done?"#6B7A99":"#E85D5D" }}>{v.dose}</span>
                {v.active && <span style={{ fontSize:8, background:"#2A0A1A", color:"#E85D5D", border:"1px solid #4A1A2A", borderRadius:3, padding:"1px 4px", fontWeight:800 }}>NOW</span>}
                {v.done && !v.active && <span style={{ fontSize:8, background:"#1A1A2A", color:"#5B5B7A", border:"1px solid #2A2A3A", borderRadius:3, padding:"1px 4px", fontWeight:800 }}>DONE</span>}
              </div>
            </div>
            <div style={{ fontSize:10, color:"#6B7A99", marginTop:2 }}>{v.note}</div>
          </div>
        ))}
        <div style={{ marginTop:8, padding:"6px 10px", background:"#120A08", border:"1px solid #2A1A10", borderRadius:7, fontSize:11, color:"#D4A055" }}>
          ⚠ 30mg + Bupropion 300mg XL = ~40–45mg equivalent. 40mg not sold in Pakistan — next step is 50mg. Equivalence figures are rough estimates.
        </div>
      </Card>

      {/* Vyvanse vs Concerta */}
      <Card>
        <ST label="Vyvanse vs Concerta — This Patient" color="#E85D5D" />
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
            <thead>
              <tr>
                <th style={{ textAlign:"left", color:"#6B7A99", fontWeight:600, padding:"4px 6px", borderBottom:"1px solid #2A2D3A" }}>Parameter</th>
                <th style={{ textAlign:"left", color:"#E85D5D", fontWeight:600, padding:"4px 6px", borderBottom:"1px solid #2A2D3A" }}>Vyvanse ✓</th>
                <th style={{ textAlign:"left", color:"#E8A838", fontWeight:600, padding:"4px 6px", borderBottom:"1px solid #2A2D3A" }}>Concerta</th>
              </tr>
            </thead>
            <tbody>
              {VYV_VS_CON.map((r,i) => (
                <tr key={i} style={{ background:i%2===0?"#141720":"transparent" }}>
                  <td style={{ color:"#9AA0B4", padding:"4px 6px" }}>{r.param}</td>
                  <td style={{ color:"#C8CAD4", padding:"4px 6px" }}>{r.vyvanse}</td>
                  <td style={{ color:"#C8CAD4", padding:"4px 6px" }}>{r.concerta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* OCD Domains */}
      <Card>
        <ST label="OCD — 3 Confirmed Domains" color="#4A9EBF" />
        {OCD_DOMAINS.map((d,i) => (
          <div key={i} style={{ display:"flex", gap:10, padding:"8px 10px", background:`${d.color}0A`, border:`1px solid ${d.color}28`, borderRadius:8, marginBottom:6 }}>
            <span style={{ fontSize:16, flexShrink:0 }}>{d.icon}</span>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:d.color, marginBottom:2 }}>{d.title}</div>
              <div style={{ fontSize:11, color:"#9AA0B4", lineHeight:1.6 }}>{d.body}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* Diagnoses */}
      <Card>
        <ST label="Diagnostic Summary" />
        {DIAGNOSES.map((d,i) => {
          const c = statusColors[d.status] || {};
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:i<DIAGNOSES.length-1?6:0 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:c.dot, flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <span style={{ fontSize:12, color:"#C8CAD4", fontWeight:600 }}>{d.label}</span>
                {d.note && <span style={{ fontSize:10, color:"#6B7A99", marginLeft:6 }}>— {d.note}</span>}
              </div>
              <span style={{ fontSize:9, background:c.bg, color:c.color, border:`1px solid ${c.border}`, borderRadius:4, padding:"1px 6px", fontWeight:700 }}>{c.label}</span>
            </div>
          );
        })}
      </Card>

      {/* Sertraline taper complete */}
      <Card>
        <ST label="Sertraline Taper — Complete ✓" color="#5B8A6F" />
        {SERTRALINE_TAPER.map((s,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"4px 8px", background:s.ceased?"#0A0A0A":"#0A150A", border:s.ceased?"1px solid #2A1010":"1px solid #1A3A1A", borderRadius:6, marginBottom:4 }}>
            <span style={{ fontSize:11 }}>{s.ceased?"✕":"✓"}</span>
            <span style={{ fontSize:11, color:"#6B7A99", minWidth:105 }}>{s.dates}</span>
            <span style={{ fontSize:12, fontWeight:700, color:s.ceased?"#E07070":"#5B8A6F" }}>{s.dose}</span>
          </div>
        ))}
      </Card>

      {/* Faverin */}
      <Card style={{ background:"#0A1520", border:"1px solid #1A3A5A" }}>
        <ST label="Faverin IR — Dosing Schedule" color="#4A9EBF" />
        {FAVERIN_SCHEDULE.map((f,i) => (
          <div key={i} style={{ padding:"6px 8px", background:f.active?"#0F2535":f.done?"#0A1A0A":"transparent", border:f.active?"1px solid #2A5A7A":f.done?"1px solid #1A3A1A":"1px solid transparent", borderRadius:7, marginBottom:4 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:10, color:f.active?"#4A9EBF":f.done?"#5B8A6F":"#6B7A99", fontWeight:f.active||f.done?700:400 }}>{f.date}</span>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:12, fontWeight:700, color:f.active?"#7AC8E8":f.done?"#7AAA8A":"#4A9EBF" }}>{f.dose}</span>
                {f.active && <span style={{ fontSize:8, background:"#1A3A5A", color:"#4A9EBF", borderRadius:3, padding:"1px 4px", fontWeight:800 }}>NOW</span>}
                {f.done   && <span style={{ fontSize:8, background:"#1A3A1A", color:"#5B8A6F", borderRadius:3, padding:"1px 4px", fontWeight:800 }}>DONE</span>}
              </div>
            </div>
            <div style={{ fontSize:10, color:"#6B7A99", marginTop:2 }}>{f.detail}</div>
          </div>
        ))}
      </Card>

      {/* Sleep protocol */}
      <Card style={{ background:"#0E0A1A", border:"1px solid #2A1A3A" }}>
        <ST label="Sleep Protocol — Oct 28 Status" color="#7A6FBF" />
        {SLEEP_PROTOCOL.map((s,i) => (
          <div key={i} style={{ display:"flex", gap:8, padding:"7px 8px", background:s.status.includes("ACTIVE")||s.status.includes("PRN")?"#12102A":s.status==="PARKED"?"#0A0A0A":"transparent", border:`1px solid ${s.status.includes("ACTIVE")||s.status.includes("PRN")?"#2A2A5A":s.status==="PARKED"?"#1A1A1A":"#1A1A2A"}`, borderRadius:7, marginBottom:5 }}>
            <div style={{ width:18, height:18, borderRadius:"50%", background:`${s.color}25`, border:`1px solid ${s.color}50`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
              <span style={{ fontSize:9, color:s.color, fontWeight:800 }}>{s.line}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
                <span style={{ fontSize:12, fontWeight:700, color:s.status==="PARKED"?"#3A3A6A":"#C8CAD4" }}>{s.name}</span>
                <span style={{ fontSize:8, color:s.color, fontWeight:700 }}>{s.status}</span>
              </div>
              <div style={{ fontSize:10, color:"#6B7A99", lineHeight:1.5 }}>{s.note}</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop:6, padding:"6px 10px", background:"#0A0810", border:"1px solid #1A1525", borderRadius:7, fontSize:11, color:"#6B7A99" }}>
          ⚠ Phone out of bedroom. Checking time · phone · mental review on waking = OCD compulsions.
        </div>
      </Card>

      {/* ATX + VYV */}
      <Card style={{ background:"#120808", border:"1px solid #3A1010" }}>
        <ST label="ATX + Vyvanse Together — Always Wrong" color="#E07070" />
        {ATX_VYV_REASONS.map((r,i) => (
          <div key={i} style={{ display:"flex", gap:8, padding:"5px 0", borderBottom:i<ATX_VYV_REASONS.length-1?"1px solid #1E0808":"none" }}>
            <span style={{ color:"#E07070", fontSize:11, flexShrink:0 }}>✗</span>
            <span style={{ fontSize:11, color:"#9AA0B4" }}>{r}</span>
          </div>
        ))}
      </Card>

      {/* OCD drugs */}
      <Card>
        <ST label="OCD Medications" color="#4A9EBF" />
        {OCD_DRUGS.map((o,i) => (
          <div key={i} style={{ display:"flex", gap:10, padding:"7px 8px", background:`${o.color}08`, border:`1px solid ${o.color}25`, borderRadius:8, marginBottom:5 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:o.color, flexShrink:0, marginTop:5 }} />
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                <span style={{ fontSize:12, fontWeight:700, color:o.color }}>{o.drug}</span>
                <span style={{ fontSize:9, background:`${o.color}18`, color:o.color, border:`1px solid ${o.color}40`, borderRadius:4, padding:"1px 5px", fontWeight:800 }}>{o.verdict}</span>
              </div>
              <div style={{ fontSize:10, color:"#9AA0B4", lineHeight:1.5 }}>{o.note}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* CYP2D6 */}
      <Card style={{ background:"#120E08", border:"1px solid #3A2A10" }}>
        <ST label="CYP2D6 — Bupropion 300mg XL Strong Inhibitor" color="#D4A055" />
        {CYP2D6_TABLE.map((c,i) => (
          <div key={i} style={{ display:"flex", gap:10, padding:"6px 0", borderBottom:i<CYP2D6_TABLE.length-1?"1px solid #1E1808":"none", alignItems:"center" }}>
            <span style={{ fontSize:11, color:c.ok?"#7AAA8A":"#D4A055", minWidth:120, fontWeight:600 }}>{c.drug}</span>
            <span style={{ fontSize:11, color:"#9AA0B4", flex:1 }}>{c.effect}</span>
            <span style={{ fontSize:10, color:c.ok?"#5B8A6F":"#8B6A30", fontWeight:700, textAlign:"right", minWidth:100 }}>{c.action}</span>
          </div>
        ))}
      </Card>

      {/* Failed drugs */}
      <Card>
        <ST label="Medications — Failed / Stopped" color="#E07070" />
        {FAILED_DRUGS.map((f,i) => (
          <div key={i} style={{ display:"flex", gap:10, padding:"4px 0", borderBottom:i<FAILED_DRUGS.length-1?"1px solid #1E2130":"none" }}>
            <span style={{ fontSize:11, color:"#E07070", minWidth:130, fontWeight:600, textDecoration:"line-through" }}>{f.drug}</span>
            <span style={{ fontSize:11, color:"#6B7A99" }}>{f.reason}</span>
          </div>
        ))}
      </Card>
    </div>
  );

  const PhasesTab = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {PHASES.map(phase => {
        const done   = !!checked[phase.id];
        const open   = !!expanded[phase.id];
        const active = !!phase.active;
        const cond   = phase.badge==="CONDITIONAL";
        return (
          <div key={phase.id} style={{ background:done?"#0D1A12":active?"#12180D":"#1A1D27", border:`1px solid ${done?"#2A4A35":active?"#3A5A20":"#2A2D3A"}`, borderRadius:11, overflow:"hidden", opacity:done?0.78:1, transition:"all 0.2s" }}>
            {active&&!done && <div style={{ background:"#243818", padding:"3px 14px", fontSize:9, color:"#90C850", fontWeight:800, letterSpacing:"0.12em" }}>▶ ACTIVE PHASE — Oct 28 Review</div>}
            {cond && <div style={{ background:"#1A1000", padding:"3px 14px", fontSize:9, color:"#D4A055", fontWeight:800, letterSpacing:"0.12em" }}>◆ CONDITIONAL</div>}
            <div style={{ display:"flex", alignItems:"center", gap:11, padding:"12px 14px", cursor:"pointer" }} onClick={() => toggleExp(phase.id)}>
              <div onClick={e=>{ e.stopPropagation(); toggle(phase.id); }} style={{ width:22, height:22, borderRadius:6, border:`2px solid ${done?"#5B8A6F":"#3A3D4A"}`, background:done?"#5B8A6F":"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, transition:"all 0.2s" }}>
                {done && <span style={{ color:"#fff", fontSize:12 }}>✓</span>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:2 }}>
                  <span style={{ fontSize:10, color:"#6B7A99", fontWeight:600 }}>{phase.dates}</span>
                  <Badge type={phase.badge} />
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:done?"#7AAA8A":active?"#90C850":"#C8CAD4" }}>{phase.label}</div>
              </div>
              <span style={{ color:"#6B7A99", fontSize:10 }}>{open?"▲":"▼"}</span>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, padding:"0 14px 12px 47px" }}>
              {phase.meds.map((m,i) => <MedPill key={i} med={m} />)}
            </div>
            {open && (
              <div style={{ padding:"0 14px 14px 47px", borderTop:"1px solid #1E2130" }}>
                <div style={{ paddingTop:12, fontSize:12, color:"#9AA0B4", lineHeight:1.75, whiteSpace:"pre-line" }}>{phase.notes}</div>
                {phase.alert && <div style={{ marginTop:10, background:"#1A0D00", border:"1px solid #4A3000", borderRadius:8, padding:"9px 12px", fontSize:11, color:"#D4A055", lineHeight:1.6 }}>⚠ {phase.alert}</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const TaperTab = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {TAPER_SCHEDULE.map(drug => (
        <div key={drug.drug} style={{ background:"#1A1D27", border:`1px solid ${drug.color}30`, borderRadius:12, overflow:"hidden" }}>
          <div style={{ background:`${drug.color}18`, borderBottom:`1px solid ${drug.color}30`, padding:"10px 16px", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:drug.color }} />
            <span style={{ fontSize:13, fontWeight:700, color:drug.color }}>{drug.drug}</span>
          </div>
          {drug.steps.map((step,i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"9px 16px", borderBottom:i<drug.steps.length-1?"1px solid #1E2130":"none", background:step.active?"#12181A":step.done?"#0D150D":"transparent" }}>
              <div style={{ fontSize:11, color:"#6B7A99", minWidth:110, flexShrink:0, paddingTop:1 }}>{step.dates}</div>
              <div style={{ flex:1 }}>
                <span style={{ fontSize:12, fontWeight:700, color:step.ceased?"#E07070":step.active?"#90C850":step.done?"#5B8A6F":drug.color }}>{step.dose}</span>
                {step.note && <span style={{ fontSize:11, color:"#6B7A99", marginLeft:8 }}>— {step.note}</span>}
                {step.active && <span style={{ fontSize:8, background:"#1A3A1A", color:"#90C850", border:"1px solid #2A5A2A", borderRadius:3, padding:"1px 5px", fontWeight:800, marginLeft:8 }}>NOW</span>}
                {step.done && !step.active && !step.ceased && <span style={{ fontSize:8, background:"#1A2A1A", color:"#5B8A6F", border:"1px solid #2A4A2A", borderRadius:3, padding:"1px 5px", fontWeight:800, marginLeft:8 }}>DONE</span>}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily:"'Inter','Segoe UI',sans-serif", background:"#0F1117", minHeight:"100vh", color:"#E8EAF0", padding:"20px 14px" }}>
      <div style={{ maxWidth:760, margin:"0 auto" }}>

        {/* HEADER */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:14 }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:"0.18em", color:"#6B7A99", textTransform:"uppercase", marginBottom:4 }}>Neuropsychiatry · Active Case</div>
            <h1 style={{ fontSize:20, fontWeight:700, margin:0, lineHeight:1.25 }}>41M · ADHD + OCD + GAD + Grief</h1>
            <div style={{ fontSize:11, color:"#6B7A99", marginTop:4 }}>MDD · Bipolar · Autism — ruled out · Jun 2025 – Jan 2026</div>
          </div>
          <div style={{ background:"#1A1D27", border:"1px solid #2A2D3A", borderRadius:10, padding:"10px 16px", textAlign:"center" }}>
            <div style={{ fontSize:26, fontWeight:700, color:"#5B8A6F" }}>{completedCount}</div>
            <div style={{ fontSize:10, color:"#6B7A99" }}>of {PHASES.length} phases</div>
          </div>
        </div>

        {/* PROGRESS */}
        <div style={{ background:"#1A1D27", borderRadius:4, height:4, overflow:"hidden", marginBottom:12 }}>
          <div style={{ height:"100%", width:`${(completedCount/PHASES.length)*100}%`, background:"linear-gradient(90deg,#5B8A6F,#4A9EBF,#E8A838,#E85D5D)", borderRadius:4, transition:"width 0.4s" }} />
        </div>

        {/* VITALS */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
          {[
            { title:"Aug 29 Vitals",  items:VITALS_AUG29,  border:"#1A3A5A", bg:"#0D1520" },
            { title:"Oct 14 Update",  items:VITALS_OCT14,  border:"#1A4A20", bg:"#0D1A10" },
            { title:"Oct 28 — Today", items:VITALS_OCT28,  border:"#3A1A1A", bg:"#1A0A0A" },
          ].map(col => (
            <div key={col.title} style={{ background:col.bg, border:`1px solid ${col.border}`, borderRadius:10, padding:"10px 12px" }}>
              <div style={{ fontSize:9, color:"#4A7A9B", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:7 }}>{col.title}</div>
              {col.items.map(v => (
                <div key={v.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <span style={{ fontSize:9, color:"#6B7A99" }}>{v.label}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:v.ok?"#7AAA8A":"#D4A055" }}>{v.ok?"✓":"⚠"} {v.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display:"flex", gap:5, marginBottom:12 }}>
          {[["summary","📋 Summary"],["phases",`🔬 Phases (${PHASES.length})`],["taper","💊 Taper"],["alerts",`⚠ Alerts (${ALERTS.length})`],["decisions",`🎯 Decisions (${DECISIONS.length})`]].map(([t,label]) => (
            <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:"8px 2px", borderRadius:8, border:`1px solid ${tab===t?"#4A5A7A":"#2A2D3A"}`, background:tab===t?"#1E2235":"#141720", color:tab===t?"#C8CAD4":"#6B7A99", fontSize:10, fontWeight:600, cursor:"pointer" }}>
              {label}
            </button>
          ))}
        </div>

        {tab==="summary"   && <SummaryTab />}
        {tab==="phases"    && <PhasesTab />}
        {tab==="taper"     && <TaperTab />}

        {tab==="alerts" && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {ALERTS.map((a,i) => (
              <div key={i} style={{ background:"#1A1D27", border:`1px solid ${a.color}30`, borderLeft:`3px solid ${a.color}`, borderRadius:10, padding:"12px 16px" }}>
                <div style={{ fontSize:12, fontWeight:700, color:a.color, marginBottom:6 }}>{a.label}</div>
                <div style={{ fontSize:12, color:"#9AA0B4", lineHeight:1.65 }}>{a.text}</div>
              </div>
            ))}
          </div>
        )}

        {tab==="decisions" && (
          <div style={{ background:"#1A1D27", border:"1px solid #2A2D3A", borderRadius:12, overflow:"hidden" }}>
            {DECISIONS.map((d,i) => (
              <div key={i} style={{ display:"flex", gap:14, padding:"12px 16px", borderBottom:i<DECISIONS.length-1?"1px solid #1E2130":"none", alignItems:"flex-start", background:d.date.includes("★")?"#1A0A0A":"transparent" }}>
                <div style={{ fontSize:11, fontWeight:800, color:d.color, minWidth:75, flexShrink:0, paddingTop:1 }}>{d.date}</div>
                <div style={{ fontSize:12, color:d.date.includes("★")?"#E8CAC0":"#9AA0B4", lineHeight:1.6 }}>{d.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* LEGEND */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:16, padding:"10px 14px", background:"#1A1D27", borderRadius:10, border:"1px solid #2A2D3A" }}>
          {Object.values(DRUGS).map(d => (
            <div key={d.name} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#9AA0B4" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:d.color }} />
              {d.name}
            </div>
          ))}
        </div>

        <div style={{ textAlign:"center", fontSize:10, color:"#2A2D3A", marginTop:12, paddingBottom:20 }}>
          Summary · Phases · Taper · Alerts · Decisions · Updated Oct 28, 2025 (schedule revised)
        </div>
      </div>
    </div>
  );
}

export default PatientTracker;
