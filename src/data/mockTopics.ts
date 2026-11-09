export interface GeneratedTopic {
  id: string;
  category: 'Travel Experiences' | 'Favorite Hobbies' | 'Current Events' | 'Dream Jobs' | 'IELTS Prep';
  level: 'Beginner (A1-A2)' | 'Intermediate (B1-B2)' | 'Advanced (C1-C2)';
  title: string;
  description: string;
  questions: string[];
  vocabulary: {
    word: string;
    ipa: string;
    meaning: string;
    exampleSentence: string;
  }[];
  icebreaker: string;
  speakingTip: string;
}

export const TOPIC_DATABASE: GeneratedTopic[] = [
  // ----------------------------------------------------
  // 1. TRAVEL EXPERIENCES
  // ----------------------------------------------------
  {
    id: 'topic-travel-1',
    category: 'Travel Experiences',
    level: 'Beginner (A1-A2)',
    title: 'My Favorite Vacation Trip',
    description: 'Talk about a place you visited on holiday, how you traveled there, and what made it fun.',
    questions: [
      'Where did you go on your last vacation, and how did you travel there?',
      'Who did you travel with, and what was the weather like?',
      'What was the most delicious food or snack you tried on the trip?',
      'Do you prefer relaxing on a sunny beach or exploring a bustling city?',
    ],
    vocabulary: [
      { word: 'souvenir', ipa: '/ˌsuː.vəˈnɪər/', meaning: 'a thing kept as a reminder of a place visited', exampleSentence: 'I bought a handmade ceramic souvenir at the street market.' },
      { word: 'scenic', ipa: '/ˈsiː.nɪk/', meaning: 'having beautiful, attractive natural scenery', exampleSentence: 'The train journey along the coast was scenic and peaceful.' },
      { word: 'relaxing', ipa: '/rɪˈlæk.sɪŋ/', meaning: 'reducing tension and helping you unwind', exampleSentence: 'Spending the weekend by the lake was very relaxing.' },
    ],
    icebreaker: 'If you had a free plane ticket right now, which country would you fly to?',
    speakingTip: 'Use simple past verbs (went, saw, ate, visited) to talk about past travel memories.',
  },
  {
    id: 'topic-travel-2',
    category: 'Travel Experiences',
    level: 'Intermediate (B1-B2)',
    title: 'Unforgettable Journeys & Cultural Surprises',
    description: 'Explore culture shock, spontaneous detours, and how traveling changes our view of the world.',
    questions: [
      'Have you ever experienced culture shock while traveling abroad? What surprised you most?',
      'Do you prefer spontaneous backpacking or thoroughly planned travel itineraries?',
      'What was an unexpected challenge you faced on a trip, and how did you resolve it?',
      'How does immersing yourself in a new country change your personal worldview?',
    ],
    vocabulary: [
      { word: 'itinerary', ipa: '/aɪˈtɪn.ər.ər.i/', meaning: 'a detailed plan or route of a journey', exampleSentence: 'We kept two free days in our itinerary for spontaneous exploration.' },
      { word: 'hospitality', ipa: '/ˌhɒs.pɪˈtæl.ə.ti/', meaning: 'friendly and generous reception of guests or visitors', exampleSentence: 'We were blown away by the warm hospitality of the locals.' },
      { word: 'off the beaten track', ipa: '/ɒf ðə ˈbiːtn træk/', meaning: 'away from where most people go or live', exampleSentence: 'We discovered a picturesque village off the beaten track.' },
    ],
    icebreaker: 'What is the most bizarre or delicious food you have ever tasted while traveling?',
    speakingTip: 'Try using connectors like "On the one hand... On the other hand..." to contrast expectations with reality.',
  },
  {
    id: 'topic-travel-3',
    category: 'Travel Experiences',
    level: 'Advanced (C1-C2)',
    title: 'Sustainable Tourism & Global Nomadism',
    description: 'Analyze the impact of mass tourism, gentrification of holiday destinations, and the rise of remote digital nomads.',
    questions: [
      'To what extent does over-tourism erode the genuine cultural heritage of historic cities?',
      'What are the ethical dilemmas surrounding high-earning remote workers flocking to developing regions?',
      'How can local governments balance economic revenue from tourism with ecological preservation?',
      'Do you believe commercial travel fosters genuine empathy or merely superficial novelty?',
    ],
    vocabulary: [
      { word: 'gentrification', ipa: '/ˌdʒen.trɪ.fɪˈkeɪ.ʃən/', meaning: 'process of urban renovation displacing original local communities', exampleSentence: 'Short-term holiday rentals contributed to the gentrification of old quarters.' },
      { word: 'sustainable', ipa: '/səˈsteɪ.nə.bəl/', meaning: 'able to be maintained without depleting natural resources', exampleSentence: 'Eco-lodges promote sustainable travel practices.' },
      { word: 'ephemeral', ipa: '/ɪˈfem.ər.əl/', meaning: 'lasting for a very short time', exampleSentence: 'Many tourist interactions remain rather ephemeral.' },
    ],
    icebreaker: 'Is there any landmark you visited that felt completely different from its Instagram reputation?',
    speakingTip: 'Utilize nuanced modal verbs (could potentially, might arguably, would inadvertently) for diplomatic debate.',
  },

  // ----------------------------------------------------
  // 2. FAVORITE HOBBIES
  // ----------------------------------------------------
  {
    id: 'topic-hobbies-1',
    category: 'Favorite Hobbies',
    level: 'Beginner (A1-A2)',
    title: 'My Free Time & Weekend Hobbies',
    description: 'Share your favorite hobbies, sports, games, and creative activities in your free time.',
    questions: [
      'What do you usually do in your free time on Saturdays and Sundays?',
      'Do you prefer indoor hobbies (like reading or gaming) or outdoor sports?',
      'How long have you been practicing your favorite hobby?',
      'What new hobby, sport, or musical instrument would you love to try this year?',
    ],
    vocabulary: [
      { word: 'leisure', ipa: '/ˈleʒ.ər/', meaning: 'time when one is not working or occupied; free time', exampleSentence: 'I spend my leisure hours cycling through the neighborhood.' },
      { word: 'creative', ipa: '/kriˈeɪ.tɪv/', meaning: 'having the ability to produce original and artistic work', exampleSentence: 'Drawing and cooking help me feel creative after work.' },
      { word: 'practice', ipa: '/ˈpræk.tɪs/', meaning: 'repeated exercise in an activity to gain skill', exampleSentence: 'I practice playing the acoustic guitar every evening.' },
    ],
    icebreaker: 'If you had an extra 3 hours every day with zero chores, what hobby would you pursue?',
    speakingTip: 'Use expressions of preference: "I am really into...", "I enjoy...", "I find it very relaxing".',
  },
  {
    id: 'topic-hobbies-2',
    category: 'Favorite Hobbies',
    level: 'Intermediate (B1-B2)',
    title: 'Passion Projects & Creative Outlets',
    description: 'Discuss how hobbies help relieve stress, build community, and foster personal self-expression.',
    questions: [
      'How does engaging in your hobby help you decompress after a stressful work week?',
      'Have you ever turned a hobby into a side project, club, or taught it to a friend?',
      'Why do you think gaming, crafting, or sports create such close-knit communities?',
      'What hobby did you love during childhood that you would love to pick back up?',
    ],
    vocabulary: [
      { word: 'cathartic', ipa: '/kəˈθɑː.tɪk/', meaning: 'providing psychological relief through open release of emotions', exampleSentence: 'Running long distances is deeply cathartic for clearing my thoughts.' },
      { word: 'dedication', ipa: '/ˌded.ɪˈkeɪ.ʃən/', meaning: 'the quality of being committed to a task or purpose', exampleSentence: 'Mastering watercolor painting takes years of patient dedication.' },
      { word: 'collaborative', ipa: '/kəˈlæb.ər.ə.tɪv/', meaning: 'conducted by two or more people working together', exampleSentence: 'Playing in an amateur sports league is a great collaborative experience.' },
    ],
    icebreaker: 'What is a niche hobby or sport you follow that most people know nothing about?',
    speakingTip: 'Describe your routine using frequency adverbs: "consistently", "from time to time", "without fail".',
  },
  {
    id: 'topic-hobbies-3',
    category: 'Favorite Hobbies',
    level: 'Advanced (C1-C2)',
    title: 'The Monetization of Leisure & The Flow State',
    description: 'Explore the psychological concept of "Flow", modern pressure to monetize hobbies into side-hustles, and slow living.',
    questions: [
      'Do you feel modern society pushes people to turn every recreational hobby into a profitable side hustle?',
      'When was the last time you experienced complete "flow"—losing all sense of time while creating something?',
      'Does high-speed digital media consumption kill our patience for mastering complex analog crafts?',
      'How does physical craftsmanship or tactile arts differ from digital creation?',
    ],
    vocabulary: [
      { word: 'flow state', ipa: '/fləʊ steɪt/', meaning: 'a mental state of complete absorption and energized focus', exampleSentence: 'Composing music puts me straight into a focused flow state.' },
      { word: 'monetization', ipa: '/ˌmʌn.ɪ.taɪˈzeɪ.ʃən/', meaning: 'the process of converting an activity into a source of revenue', exampleSentence: 'The monetization of personal hobbies can sometimes ruin the pure joy.' },
      { word: 'rejuvenation', ipa: '/rɪˌdʒuː.vənˈeɪ.ʃən/', meaning: 'the action of giving new energy or vitality', exampleSentence: 'Solitary gardening provides immense mental rejuvenation.' },
    ],
    icebreaker: 'Is there a skill you practiced for months and eventually abandoned? What did you learn?',
    speakingTip: 'Incorporate idiomatic expressions: "a double-edged sword", "lost in the zone", "burn the candle at both ends".',
  },

  // ----------------------------------------------------
  // 3. CURRENT EVENTS & MODERN SOCIETY
  // ----------------------------------------------------
  {
    id: 'topic-current-1',
    category: 'Current Events',
    level: 'Beginner (A1-A2)',
    title: 'Daily News, Weather & Community Life',
    description: 'Talk about everyday news, weather changes, and what is happening in your local neighborhood.',
    questions: [
      'How do you usually get your daily news (e.g. smartphone apps, television, radio, or friends)?',
      'How has the weather in your hometown changed over the past few years?',
      'What is an exciting event or festival happening in your city this month?',
      'Do you like discussing news stories with family or do you prefer keeping up privately?',
    ],
    vocabulary: [
      { word: 'headline', ipa: '/ˈhed.laɪn/', meaning: 'a heading at the top of an article or news report', exampleSentence: 'I read the morning headlines while drinking my breakfast tea.' },
      { word: 'community', ipa: '/kəˈmjuː.nə.ti/', meaning: 'a group of people living in the same place or having a particular characteristic in common', exampleSentence: 'Our local community organized a park clean-up last Saturday.' },
      { word: 'forecast', ipa: '/ˈfɔː.kɑːst/', meaning: 'a prediction or estimate of future events, especially weather', exampleSentence: 'The weather forecast predicts sunshine for the entire weekend.' },
    ],
    icebreaker: 'What was the most positive news story you heard recently?',
    speakingTip: 'Start your sentences with simple time markers: "Recently...", "This week...", "In my town...".',
  },
  {
    id: 'topic-current-2',
    category: 'Current Events',
    level: 'Intermediate (B1-B2)',
    title: 'Social Media, Digital Habits & Fact-Checking',
    description: 'Examine how digital algorithms, short-form video clips, and notification pings affect our attention and relationships.',
    questions: [
      'How much time do you spend on your smartphone daily? Have you ever tried a digital detox?',
      'In what ways has the internet made it easier or harder to maintain international friendships?',
      'Do you think children under 14 should have unrestricted smartphone access?',
      'How do you verify whether an online news article or viral video clip is genuine?',
    ],
    vocabulary: [
      { word: 'misinformation', ipa: '/ˌmɪs.ɪn.fəˈmeɪ.ʃən/', meaning: 'false or inaccurate information that is spread unintentionally', exampleSentence: 'Social platforms must do more to curb viral misinformation.' },
      { word: 'attention span', ipa: '/əˈten.ʃən spæn/', meaning: 'the length of time for which a person can concentrate', exampleSentence: 'Short-form video apps have significantly reduced our attention span.' },
      { word: 'mindfulness', ipa: '/ˈmaɪnd.fəl.nəs/', meaning: 'maintaining a moment-by-moment awareness of our habits', exampleSentence: 'Practicing digital mindfulness helped me sleep much better.' },
    ],
    icebreaker: 'What app on your phone would you delete first if you were forced to remove all social media?',
    speakingTip: 'Frame your thoughts clearly: "In my perspective...", "Statistics often show...", "On a personal level...".',
  },
  {
    id: 'topic-current-3',
    category: 'Current Events',
    level: 'Advanced (C1-C2)',
    title: 'Artificial Intelligence, Ethics & The Future of Society',
    description: 'Debate the socio-economic impact of foundation models, copyright, automated decision making, and technological unemployment.',
    questions: [
      'Will generative AI tools level the playing field for non-native English speakers or create new divides?',
      'Should intellectual property laws be radically revised to address training models on human artistic data?',
      'What safeguard mechanisms should be implemented before autonomous AI agents make critical medical or legal calls?',
      'How will human identity and creative fulfillment shift in an era of abundant synthetic media?',
    ],
    vocabulary: [
      { word: 'existential', ipa: '/ˌeɡ.zɪˈsten.ʃəl/', meaning: 'relating to human existence or survival', exampleSentence: 'Scholars actively debate the existential risks of superintelligence.' },
      { word: 'hallucination', ipa: '/həˌluː.sɪˈneɪ.ʃən/', meaning: 'confident presentation of false data by a generative model', exampleSentence: 'Factual verification is essential to counter model hallucinations.' },
      { word: 'disruption', ipa: '/dɪsˈrʌp.ʃən/', meaning: 'radical change to an existing industry or social institution', exampleSentence: 'Language translation services are undergoing seismic disruption.' },
    ],
    icebreaker: 'Would you feel comfortable having an AI judge decide a legal court case for you? Why or why not?',
    speakingTip: 'Use concession structures: "While it is true that [X], one cannot overlook the reality that [Y]".',
  },

  // ----------------------------------------------------
  // 4. DREAM JOBS & CAREER AMBITIONS
  // ----------------------------------------------------
  {
    id: 'topic-jobs-1',
    category: 'Dream Jobs',
    level: 'Beginner (A1-A2)',
    title: 'My Ideal Job & Daily Work Routine',
    description: 'Talk about your ideal profession, what you wanted to be when you grew up, and what skills you need.',
    questions: [
      'What job did you want to do when you were a child?',
      'What is your ideal work schedule (e.g. 9 to 5, flexible hours, or working from home)?',
      'What is more important to you: a high salary or working with friendly, supportive colleagues?',
      'What new work skill would you like to master in the next two years?',
    ],
    vocabulary: [
      { word: 'colleague', ipa: '/ˈkɒl.iːɡ/', meaning: 'a person with whom one works in a profession or business', exampleSentence: 'My colleagues are very supportive whenever I start a new project.' },
      { word: 'flexible', ipa: '/ˈflek.sə.bəl/', meaning: 'able to be easily modified to respond to altered circumstances', exampleSentence: 'Having flexible working hours lets me drop my kids at school.' },
      { word: 'ambitious', ipa: '/æmˈbɪʃ.əs/', meaning: 'having or showing a strong desire and determination to succeed', exampleSentence: 'She is ambitious and wants to become a design lead.' },
    ],
    icebreaker: 'If you could swap jobs with any celebrity or professional for one week, who would you choose?',
    speakingTip: 'Practice future aspirations: "I hope to...", "My goal is to...", "I would love to work as a...".',
  },
  {
    id: 'topic-jobs-2',
    category: 'Dream Jobs',
    level: 'Intermediate (B1-B2)',
    title: 'Workplace Culture, Leadership & Remote Work',
    description: 'Discuss modern office dynamics, healthy work-life balance, and surviving job interviews in English.',
    questions: [
      'Do you thrive better working fully remotely, in an office, or in a hybrid setup? Why?',
      'What makes a manager an inspirational leader rather than just an authoritarian boss?',
      'How do you handle difficult conversations or disagreements with team members professionally?',
      'If money were no object, what kind of project, school, or business would you start tomorrow?',
    ],
    vocabulary: [
      { word: 'work-life balance', ipa: '/wɜːk laɪf ˈbæl.əns/', meaning: 'the division of one’s time between work and leisure', exampleSentence: 'Maintaining a healthy work-life balance prevents workplace burnout.' },
      { word: 'constructive', ipa: '/kənˈstrʌk.tɪv/', meaning: 'serving a useful purpose; tending to build up', exampleSentence: 'Receiving constructive feedback helped me sharpen my presentations.' },
      { word: 'initiative', ipa: '/ɪˈnɪʃ.ə.tɪv/', meaning: 'the power or opportunity to act or take charge before others do', exampleSentence: 'She took the initiative to reorganize our sprint board.' },
    ],
    icebreaker: 'What was the funniest or most unusual job interview question you were ever asked?',
    speakingTip: 'Use the STAR method (Situation, Task, Action, Result) when describing workplace accomplishments.',
  },
  {
    id: 'topic-jobs-3',
    category: 'Dream Jobs',
    level: 'Advanced (C1-C2)',
    title: 'Executive Leadership & Organizational Culture',
    description: 'Analyze corporate governance, psychological safety in teams, executive presence, and modern talent retention.',
    questions: [
      'What constitutes genuine psychological safety in high-stakes corporate environments?',
      'How can multinational companies foster cohesion across starkly different cultural paradigms?',
      'Is the traditional corporate hierarchy giving way to flatter, decentralized organizations?',
      'How does an executive cultivate authentic charisma and gravitas in all-hands addresses?',
    ],
    vocabulary: [
      { word: 'psychological safety', ipa: '/ˌsaɪ.kəˈlɒdʒ.ɪ.kəl ˈseɪf.ti/', meaning: 'a climate where one feels safe to take interpersonal risks', exampleSentence: 'Teams with high psychological safety report far more innovative ideas.' },
      { word: 'decentralized', ipa: '/diːˈsen.trə.laɪzd/', meaning: 'controlled by several local offices rather than one single central authority', exampleSentence: 'A decentralized organization empowers autonomous problem-solving.' },
      { word: 'gravitas', ipa: '/ˈɡræv.ɪ.tæs/', meaning: 'dignity, seriousness, or solemnity of manner', exampleSentence: 'The keynote speaker spoke with natural gravitas and poise.' },
    ],
    icebreaker: 'What is the most overrated piece of conventional career advice you often hear?',
    speakingTip: 'Deploy sophisticated discourse markers: "Paradoxically", "In light of recent developments", "It stands to reason that".',
  },

  // ----------------------------------------------------
  // 5. IELTS SPEAKING PRACTICE
  // ----------------------------------------------------
  {
    id: 'topic-ielts-1',
    category: 'IELTS Prep',
    level: 'Intermediate (B1-B2)',
    title: 'Speaking Part 2: An Object You Treasure',
    description: 'Deliver a structured 2-minute speech describing a sentimental possession, how you acquired it, and why it matters.',
    questions: [
      'What is the object, and who gave it to you (or where did you buy it)?',
      'How long have you had it, and how often do you use or look at it?',
      'Why is this particular object irreplaceable to you compared to expensive things?',
      'Do you think modern consumers place too much value on material belongings?',
    ],
    vocabulary: [
      { word: 'heirloom', ipa: '/ˈeə.luːm/', meaning: 'a valuable object that has belonged to a family for several generations', exampleSentence: 'This pocket watch is a cherished family heirloom.' },
      { word: 'sentimental', ipa: '/ˌsen.tɪˈmen.təl/', meaning: 'prompted by or related to tender feelings and memories', exampleSentence: 'The handmade scrapbook has immense sentimental value.' },
      { word: 'irreplaceable', ipa: '/ˌɪr.ɪˈpleɪ.sə.bəl/', meaning: 'impossible to replace if lost or damaged', exampleSentence: 'Old family photographs are truly irreplaceable.' },
    ],
    icebreaker: 'If your house was on fire and all people/pets were safe, what single item would you run back for?',
    speakingTip: 'Structure your Part 2 answer chronologically: Background -> Description -> Key Event -> Personal Reflection.',
  },
];
