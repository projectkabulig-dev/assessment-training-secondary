/* ==========================================================
   ITEM BANK — 15 original items (5 English · 5 Science · 5 Math)
   Hinango ang format sa sample ng 21st Century Skills (NAT Grade 12):
   Subject → 21st Century Skill → Sub-skill → Content → Item
   Lahat ng passages at data ay gawa-gawa lamang para sa test na ito.
   ========================================================== */
window.ITEMS = [
/* ───────────── ENGLISH (Language and Communication) ───────────── */
{
  id: 1, subject: "English", skill: "Information Literacy", subskill: "Evaluating sources of information",
  content: "Reading Comprehension: Reliability of Sources",
  stem: `<p>Ms. Reyes, a principal, is writing a policy brief on <b>teacher workload</b>. She found four sources.</p>
  <table class="dt"><thead><tr><th>Source</th><th>Author</th><th>Year</th><th>Evidence used</th><th>Funded by</th></tr></thead><tbody>
  <tr><td>1</td><td>Education researcher (PhD)</td><td>2025</td><td>Survey of 2,400 teachers; methods published</td><td>Public university</td></tr>
  <tr><td>2</td><td>Owner of a review center</td><td>2025</td><td>Personal experience only</td><td>His own business</td></tr>
  <tr><td>3</td><td>Anonymous blogger</td><td>2019</td><td>"Many people say…"</td><td>Not stated</td></tr>
  <tr><td>4</td><td>News reporter</td><td>2025</td><td>Quotes one principal</td><td>News outlet</td></tr></tbody></table>
  <p class="q">Which source should she rely on MOST?</p>`,
  q: "Which source should she rely on most for her policy brief?",
  options: [
    "Source 2, because the author has direct experience with schools",
    "Source 1, because its claims rest on published methods and a large sample",
    "Source 3, because it reflects what many people say",
    "Source 4, because it was written by a news professional and is recent"],
  key: "B",
  why: "Source 1 has a named expert author, a large sample, published methods and a neutral funder. The others rely on experience, hearsay, or a single quote."
},
{
  id: 2, subject: "English", skill: "Critical Thinking", subskill: "Analyzing relevance",
  content: "Evaluating Claims and Supporting Evidence",
  stem: `<p>A school head announces: <i>"Our new reading program improved the reading skills of our Grade 3 learners."</i></p>
  <p class="q">Which evidence is MOST relevant to support this claim?</p>`,
  q: "Which evidence is most relevant to support the claim that the reading program improved Grade 3 reading skills?",
  options: [
    "The program was cheaper than other commercial programs.",
    "Teachers said the training seminar was well organized.",
    "Grade 3 reading scores rose from 58% to 71% in one year, while a similar school without the program stayed at 59%.",
    "Parents donated 200 storybooks to the school library."],
  key: "C",
  why: "Only the score gain, compared with a similar school, speaks directly to improvement in reading skills. Cost, training quality and donations do not."
},
{
  id: 3, subject: "English", skill: "Communication", subskill: "Adjusting message to purpose and audience",
  content: "Communicative Competence in Various Speech Situations",
  stem: `<p>A typhoon is expected to hit the province tomorrow. The school head must send a <b>text message to parents</b> announcing the class suspension.</p>
  <p class="q">Which message is MOST appropriate for the purpose and audience?</p>`,
  q: "Which text message is most appropriate for announcing a class suspension to parents?",
  options: [
    "Classes in all levels are suspended tomorrow, Nov. 20, due to Typhoon Ramon. Please keep children at home. Updates will be posted on the school's Facebook page.",
    "Greetings, esteemed parents! In light of meteorological developments, we deem it prudent to consider the possible cessation of academic activities at some future time.",
    "Guys, walang pasok bukas lol, bagyo daw. Ingat!",
    "Typhoon Ramon is coming. Parents should be responsible and stay alert."],
  key: "A",
  why: "It is clear, complete (who, what, when, why, next step) and uses a respectful, direct tone. The others are wordy, too casual, or vague."
},
{
  id: 4, subject: "English", skill: "Critical Thinking", subskill: "Evaluating arguments",
  content: "Persuasive Techniques and Faulty Reasoning",
  stem: `<blockquote>"Since Mayor Dela Cruz launched the school feeding program, enrollment in the municipality has risen by 12%. Clearly, the feeding program is the reason more children are going to school."</blockquote>
  <p class="q">Which statement BEST points out the weakness of this argument?</p>`,
  q: "Which statement best points out the weakness of the mayor's argument?",
  options: [
    "It does not state how much the program cost.",
    "It uses the mayor's name, which makes the claim biased.",
    "It relies on a statistic that is too small to be meaningful.",
    "It assumes that because one event followed another, the first caused the second, ignoring other possible factors."],
  key: "D",
  why: "This is a post hoc fallacy: a rise in enrollment after the program does not prove the program caused it."
},
{
  id: 5, subject: "English", skill: "Communication", subskill: "Integrating ideas from multiple texts",
  content: "Synthesizing Information from Two Texts",
  stem: `<div class="two"><div><b>Text 1</b><p>After the municipality banned single-use plastic bags in 2023, the plastic waste collected in the public market dropped by 40% in one year.</p></div>
  <div><b>Text 2</b><p>A (fictional) life-cycle report says a cloth bag must be reused many times before its overall environmental impact becomes lower than a plastic bag's. Many shoppers use their cloth bags only a few times.</p></div></div>
  <p class="q">Which statement BEST combines the ideas of both texts?</p>`,
  q: "Which statement best combines the ideas of both texts?",
  options: [
    "Plastic bag bans are ineffective and should be removed.",
    "Bans can reduce visible plastic waste, but the overall environmental benefit depends on how often substitutes are reused.",
    "Cloth bags are worse for the environment than plastic bags in every situation.",
    "The municipality should ban cloth bags because they are used only a few times."],
  key: "B",
  why: "A good synthesis keeps both findings: the ban cut waste (Text 1) and the benefit depends on reuse (Text 2)."
},

/* ───────────── SCIENCE ───────────── */
{
  id: 6, subject: "Science", skill: "Information Literacy", subskill: "Interpreting data",
  content: "Natural Hazards: Rainfall and Landslides",
  stem: `<p>A barangay recorded its monthly rainfall and the number of landslides.</p>
  <table class="dt tight"><thead><tr><th>Month</th><th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>May</th><th>Jun</th><th>Jul</th><th>Aug</th></tr></thead><tbody>
  <tr><td>Rainfall (mm)</td><td>150</td><td>90</td><td>60</td><td>70</td><td>180</td><td>320</td><td>400</td><td>380</td></tr>
  <tr><td>Landslides</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>3</td><td>6</td><td>5</td></tr></tbody></table>
  <p class="q">Which conclusion is BEST supported by the data?</p>`,
  q: "Which conclusion is best supported by the rainfall and landslide data?",
  options: [
    "Months with heavier rainfall tended to have more landslides.",
    "Landslides in the barangay cause heavier rainfall.",
    "Landslides happen only when rainfall is above 400 mm.",
    "Months with less than 100 mm of rainfall had the most landslides."],
  key: "A",
  why: "The data show an association: landslides rise with rainfall. It does not show that landslides cause rain, nor a strict 400 mm threshold."
},
{
  id: 7, subject: "Science", skill: "Critical Thinking", subskill: "Using evidence to formulate an argument",
  content: "Photosynthesis and Limiting Factors",
  stem: `<p>A student claims: <i>"The more hours of light a plant receives, the taller it grows."</i> Five identical plants were grown with different hours of light daily.</p>
  <table class="dt tight"><thead><tr><th>Hours of light per day</th><th>4</th><th>8</th><th>12</th><th>16</th><th>20</th></tr></thead><tbody>
  <tr><td>Height after 4 weeks (cm)</td><td>5.0</td><td>9.0</td><td>14.0</td><td>14.5</td><td>14.2</td></tr></tbody></table>
  <p class="q">Which argument is BEST supported by the data?</p>`,
  q: "Which argument about the student's claim is best supported by the data?",
  options: [
    "The claim is correct because plants under 20 hours of light were taller than plants under 4 hours.",
    "The claim is correct because the height increased in every group.",
    "The claim is incorrect because plants grew best with the shortest hours of light.",
    "The claim is only partly correct: height increased up to about 12 hours, after which more light gave no meaningful gain."],
  key: "D",
  why: "Growth rose from 4 to 12 hours and then leveled off (and slightly dropped at 20 hours), so more light does not always mean more growth."
},
{
  id: 8, subject: "Science", skill: "Problem Solving", subskill: "Selecting an appropriate solution",
  content: "Acids, Bases and pH",
  stem: `<p>The water in a fishpond has a <b>pH of 5.5</b> (acidic). The fish grow best in water with a pH of 7 to 8.</p>
  <p class="q">Which action is MOST appropriate to correct the pond water?</p>`,
  q: "Which action is most appropriate to correct a fishpond with pH 5.5?",
  options: [
    "Add vinegar (acetic acid)",
    "Add ammonium sulfate fertilizer",
    "Add agricultural lime (calcium carbonate)",
    "Add sugar"],
  key: "C",
  why: "Lime is a base and raises pH. Vinegar and ammonium sulfate make water more acidic; sugar does not change pH meaningfully."
},
{
  id: 9, subject: "Science", skill: "Creativity", subskill: "Generating and evaluating design ideas",
  content: "Heat Transfer: Radiation, Convection and Conduction",
  stem: `<p>A school without air conditioning has classrooms that become very hot in the afternoon. The school head wants a <b>low-cost design</b> that applies the principles of heat transfer.</p>
  <p class="q">Which design is BEST?</p>`,
  q: "Which low-cost design best applies the principles of heat transfer to cool the classrooms?",
  options: [
    "Paint the roof black and keep all windows closed.",
    "Paint the roof white and install vents near the ceiling so warm air can escape.",
    "Install metal ceilings so heat moves faster into the room.",
    "Cover the windows with aluminum sheets and seal all openings."],
  key: "B",
  why: "A white roof reflects radiation, and high vents let rising warm air leave by convection. The other options absorb, conduct or trap heat."
},
{
  id: 10, subject: "Science", skill: "Problem Solving", subskill: "Applying a quantitative rule",
  content: "Energy Flow in Ecosystems",
  stem: `<p>In a mangrove food chain, <b>algae → shrimp → snapper → osprey</b>, the algae (producers) hold <b>20,000 kJ</b> of energy. Assume only <b>10%</b> of the energy is passed to each next feeding level.</p>
  <p class="q">How much energy is available to the osprey (tertiary consumer)?</p>`,
  q: "How much energy is available to the osprey (tertiary consumer)?",
  options: ["2,000 kJ", "200 kJ", "20 kJ", "2 kJ"],
  key: "C",
  why: "20,000 → 2,000 (shrimp) → 200 (snapper) → 20 kJ (osprey). Three transfers, each ×0.10."
},

/* ───────────── MATHEMATICS ───────────── */
{
  id: 11, subject: "Math", skill: "Information Literacy", subskill: "Ability to manage information",
  content: "Probability: Total Probability from a Table",
  stem: `<p>A senior high school has three strands. The table shows the share of Grade 12 enrollment and the proportion of learners in each strand who passed a mock test.</p>
  <table class="dt"><thead><tr><th>Strand</th><th>Share of enrollment</th><th>Passed</th></tr></thead><tbody>
  <tr><td>ABM</td><td>25%</td><td>80%</td></tr><tr><td>STEM</td><td>35%</td><td>90%</td></tr><tr><td>HUMSS</td><td>40%</td><td>70%</td></tr></tbody></table>
  <p class="q">What is the probability that a randomly selected Grade 12 learner passed?</p>`,
  q: "What is the probability that a randomly selected Grade 12 learner passed the mock test?",
  options: ["0.80", "0.795", "0.315", "0.84"],
  key: "B",
  why: "P(pass) = 0.25(0.80) + 0.35(0.90) + 0.40(0.70) = 0.20 + 0.315 + 0.28 = 0.795. A simple average (0.80) ignores the unequal enrollment."
},
{
  id: 12, subject: "Math", skill: "Critical Thinking", subskill: "Using evidence to formulate an argument",
  content: "Business Mathematics: Simple and Compound Interest",
  stem: `<p>Mr. Cruz will invest ₱50,000 for 3 years.</p>
  <table class="dt"><thead><tr><th>Option</th><th>Rate</th><th>Type of interest</th><th>Time</th></tr></thead><tbody>
  <tr><td>Bank A</td><td>6% per year</td><td>Simple</td><td>3 years</td></tr>
  <tr><td>Bank B</td><td>5.5% per year</td><td>Compounded annually</td><td>3 years</td></tr></tbody></table>
  <p class="q">Which option gives the greater amount, and why?</p>`,
  q: "Which option gives the greater amount after 3 years, and why?",
  options: [
    "Bank A: ₱59,000.00 is greater than ₱58,712.07, because 6% simple interest earns more than 5.5% compounded annually over 3 years.",
    "Bank B, because compounding always gives a larger amount than simple interest.",
    "Both are equal, since the principal and the time are the same.",
    "Bank B, because its interest keeps growing every year while Bank A's stays the same."],
  key: "A",
  why: "Bank A: 50,000(1 + 0.06×3) = ₱59,000. Bank B: 50,000(1.055)³ ≈ ₱58,712.07. Compounding does not always beat a higher simple rate."
},
{
  id: 13, subject: "Math", skill: "Problem Solving", subskill: "Analyzing outcomes",
  content: "Functions: Composition of Functions",
  stem: `<p>An online store gives a <b>20% discount</b> on the price <i>x</i> of an item, and then adds a <b>₱50 shipping fee</b> to the discounted price.</p>
  <p class="q">How much will a customer pay for an item priced at ₱1,500?</p>`,
  q: "How much will a customer pay for an item priced at ₱1,500?",
  options: ["₱1,150", "₱1,240", "₱1,300", "₱1,250"],
  key: "D",
  why: "p(x) = 0.8x, s(x) = x + 50, so s(p(1500)) = 1,200 + 50 = ₱1,250. Adding shipping before the discount gives ₱1,240."
},
{
  id: 14, subject: "Math", skill: "Critical Thinking", subskill: "Drawing conclusions from data",
  content: "Normal Distribution and z-scores",
  stem: `<p>Two learners took entrance exams in different schools.</p>
  <table class="dt"><thead><tr><th>Learner</th><th>Score</th><th>Mean of group</th><th>Standard deviation</th></tr></thead><tbody>
  <tr><td>Maria (School A)</td><td>82</td><td>70</td><td>8</td></tr><tr><td>Joel (School B)</td><td>640</td><td>500</td><td>100</td></tr></tbody></table>
  <p class="q">Who performed better compared with his or her own group?</p>`,
  q: "Who performed better compared with his or her own group?",
  options: [
    "Joel, because 640 is much higher than 82.",
    "Joel, because his score is 140 points above the mean.",
    "Maria, because her score is 1.5 standard deviations above the mean while Joel's is 1.4.",
    "Both performed equally, since both scored above the mean."],
  key: "C",
  why: "z(Maria) = (82 − 70)/8 = 1.5; z(Joel) = (640 − 500)/100 = 1.4. Standard scores allow fair comparison across different scales."
},
{
  id: 15, subject: "Math", skill: "Information Literacy", subskill: "Evaluating information",
  content: "Sampling Techniques",
  stem: `<p>A principal wants to know the opinion of all <b>1,200 learners</b> on a proposed new class schedule. She surveys the <b>first 40 learners</b> who line up at the canteen during lunch.</p>
  <p class="q">What is the MAIN weakness of this sampling method?</p>`,
  q: "What is the main weakness of surveying the first 40 learners at the canteen?",
  options: [
    "The sample may not represent all learners because it was not randomly selected.",
    "A sample of 40 can never represent 1,200 learners, no matter how it is chosen.",
    "Opinion surveys can only be done on the whole population.",
    "The survey should have been given to teachers, not learners."],
  key: "A",
  why: "A convenience sample can be biased (for example, it leaves out learners who bring packed lunch). Random selection helps the sample represent the population."
}
];

window.SUBJECTS = ["English", "Science", "Math"];
window.SUBJECT_LABEL = { English: "English · Language & Communication", Science: "Science", Math: "Mathematics" };
