export interface GlobalUniversity {
  name: string;
  country: string;
  countryCode: string;
  alpha_two_code: string;
  web_pages: string[];
  domains: string[];
  estimatedTuition: string;
  estimatedLivingCost: string;
  requiredIelts: string;
  requiredCgpa: string;
  scholarshipInfo: string;
  rankEstimate: string;
  officialLink: string;
}

// Country Flag Emoji Map
const COUNTRY_FLAGS: Record<string, string> = {
  'United States': '🇺🇸',
  'United Kingdom': '🇬🇧',
  Canada: '🇨🇦',
  Australia: '🇦🇺',
  Germany: '🇩🇪',
  Japan: '🇯🇵',
  Sweden: '🇸🇪',
  France: '🇫🇷',
  Netherlands: '🇳🇱',
  Malaysia: '🇲🇾',
  China: '🇨🇳',
  India: '🇮🇳',
  Bangladesh: '🇧🇩',
  Singapore: '🇸🇬',
  Italy: '🇮🇹',
  Spain: '🇪🇸',
  'South Korea': '🇰🇷',
  'New Zealand': '🇳🇿',
  Switzerland: '🇨🇭',
};

// Curated Top Fallback Universities for instant loading
const POPULAR_UNIVERSITIES: GlobalUniversity[] = [
  {
    name: 'Massachusetts Institute of Technology (MIT)',
    country: 'United States',
    countryCode: 'US',
    alpha_two_code: 'US',
    web_pages: ['http://www.mit.edu/'],
    domains: ['mit.edu'],
    estimatedTuition: '$57,590 / year',
    estimatedLivingCost: '$1,200 / month',
    requiredIelts: '7.5',
    requiredCgpa: '3.80',
    scholarshipInfo: 'Full Scholarship & TA/RA Available',
    rankEstimate: '#1 World Rank',
    officialLink: 'http://www.mit.edu/',
  },
  {
    name: 'University of Cambridge',
    country: 'United Kingdom',
    countryCode: 'GB',
    alpha_two_code: 'GB',
    web_pages: ['http://www.cam.ac.uk/'],
    domains: ['cam.ac.uk'],
    estimatedTuition: '£37,293 / year',
    estimatedLivingCost: '£1,100 / month',
    requiredIelts: '7.5',
    requiredCgpa: '3.70',
    scholarshipInfo: 'Gates Cambridge Scholarship (Full Free)',
    rankEstimate: '#2 World Rank',
    officialLink: 'http://www.cam.ac.uk/',
  },
  {
    name: 'University of Oxford',
    country: 'United Kingdom',
    countryCode: 'GB',
    alpha_two_code: 'GB',
    web_pages: ['http://www.ox.ac.uk/'],
    domains: ['ox.ac.uk'],
    estimatedTuition: '£38,500 / year',
    estimatedLivingCost: '£1,200 / month',
    requiredIelts: '7.5',
    requiredCgpa: '3.75',
    scholarshipInfo: 'Rhodes Scholarship (Full Free)',
    rankEstimate: '#3 World Rank',
    officialLink: 'http://www.ox.ac.uk/',
  },
  {
    name: 'Harvard University',
    country: 'United States',
    countryCode: 'US',
    alpha_two_code: 'US',
    web_pages: ['http://www.harvard.edu/'],
    domains: ['harvard.edu'],
    estimatedTuition: '$54,768 / year',
    estimatedLivingCost: ' $1,300 / month',
    requiredIelts: '7.5',
    requiredCgpa: '3.85',
    scholarshipInfo: '100% Need-Based Financial Aid',
    rankEstimate: '#4 World Rank',
    officialLink: 'http://www.harvard.edu/',
  },
  {
    name: 'University of Toronto',
    country: 'Canada',
    countryCode: 'CA',
    alpha_two_code: 'CA',
    web_pages: ['http://www.utoronto.ca/'],
    domains: ['utoronto.ca'],
    estimatedTuition: 'CAD $32,000 / year',
    estimatedLivingCost: 'CAD $1,400 / month',
    requiredIelts: '7.0',
    requiredCgpa: '3.50',
    scholarshipInfo: '50% Tuition Waiver & Teaching Assistantship',
    rankEstimate: '#18 World Rank',
    officialLink: 'http://www.utoronto.ca/',
  },
  {
    name: 'Technical University of Munich (TUM)',
    country: 'Germany',
    countryCode: 'DE',
    alpha_two_code: 'DE',
    web_pages: ['http://www.tum.de/'],
    domains: ['tum.de'],
    estimatedTuition: '€0 (Tuition-Free - Semester Fee €150)',
    estimatedLivingCost: '€950 / month',
    requiredIelts: '6.5',
    requiredCgpa: '3.20',
    scholarshipInfo: 'DAAD Full Scholarship Available',
    rankEstimate: '#37 World Rank',
    officialLink: 'http://www.tum.de/',
  },
  {
    name: 'University of Melbourne',
    country: 'Australia',
    countryCode: 'AU',
    alpha_two_code: 'AU',
    web_pages: ['http://www.unimelb.edu.au/'],
    domains: ['unimelb.edu.au'],
    estimatedTuition: 'AUD $46,500 / year',
    estimatedLivingCost: 'AUD $1,300 / month',
    requiredIelts: '6.5',
    requiredCgpa: '3.30',
    scholarshipInfo: 'Melbourne International Scholarship',
    rankEstimate: '#14 World Rank',
    officialLink: 'http://www.unimelb.edu.au/',
  },
  {
    name: 'University of Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    alpha_two_code: 'JP',
    web_pages: ['http://www.u-tokyo.ac.jp/'],
    domains: ['u-tokyo.ac.jp'],
    estimatedTuition: '¥535,800 / year',
    estimatedLivingCost: '¥120,000 / month',
    requiredIelts: '6.5',
    requiredCgpa: '3.40',
    scholarshipInfo: 'MEXT Japanese Government Full Scholarship',
    rankEstimate: '#28 World Rank',
    officialLink: 'http://www.u-tokyo.ac.jp/',
  },
];

// Helper to compute smart requirements based on university tier & country
function formatUniversity(raw: any): GlobalUniversity {
  const name = raw.name || 'Global University';
  const country = raw.country || 'International';
  const web_pages = raw.web_pages || [];
  const officialLink = web_pages[0] || (raw.domains && raw.domains[0] ? `http://www.${raw.domains[0]}` : '#');
  const alpha_two_code = raw.alpha_two_code || 'US';

  // Smart Tuition & Requirements Estimator based on country
  let estimatedTuition = '$15,000 / year';
  let estimatedLivingCost = '$900 / month';
  let requiredIelts = '6.5';
  let requiredCgpa = '3.25';
  let scholarshipInfo = 'Partial Scholarship & Assistantship Available';
  let rankEstimate = 'Recognized International University';

  if (country === 'Germany' || country === 'Norway' || country === 'Austria') {
    estimatedTuition = '€0 (Tuition-Free / €150 Semester Fee)';
    estimatedLivingCost = '€900 / month';
    requiredIelts = '6.5';
    requiredCgpa = '3.00';
    scholarshipInfo = 'DAAD & State Scholarships Available';
  } else if (country === 'United States') {
    estimatedTuition = '$28,000 - $55,000 / year';
    estimatedLivingCost = '$1,200 / month';
    requiredIelts = '7.0';
    requiredCgpa = '3.40';
    scholarshipInfo = 'Need-Based & Merit Scholarships + TA/RA';
  } else if (country === 'United Kingdom') {
    estimatedTuition = '£18,000 - £35,000 / year';
    estimatedLivingCost = '£1,100 / month';
    requiredIelts = '6.5 - 7.0';
    requiredCgpa = '3.30';
    scholarshipInfo = 'Chevening & Commonwealth Scholarships';
  } else if (country === 'Canada') {
    estimatedTuition = 'CAD $22,000 - $38,000 / year';
    estimatedLivingCost = 'CAD $1,300 / month';
    requiredIelts = '6.5';
    requiredCgpa = '3.20';
    scholarshipInfo = 'Vanier & University Assistantships';
  } else if (country === 'Australia') {
    estimatedTuition = 'AUD $30,000 - $45,000 / year';
    estimatedLivingCost = 'AUD $1,400 / month';
    requiredIelts = '6.5';
    requiredCgpa = '3.15';
    scholarshipInfo = 'Australia Awards & International Fellowships';
  }

  return {
    name,
    country,
    countryCode: alpha_two_code,
    alpha_two_code,
    web_pages,
    domains: raw.domains || [],
    estimatedTuition,
    estimatedLivingCost,
    requiredIelts,
    requiredCgpa,
    scholarshipInfo,
    rankEstimate,
    officialLink,
  };
}

export async function searchGlobalUniversities(query?: string, country?: string): Promise<GlobalUniversity[]> {
  try {
    const params = new URLSearchParams();
    if (query && query.trim()) params.set('name', query.trim());
    if (country && country.trim()) params.set('country', country.trim());

    // Fetch from free public Hipolabs Global University API (10,000+ universities)
    const res = await fetch(`http://universities.hipolabs.com/search?${params.toString()}`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const rawData = await res.json();
      if (Array.isArray(rawData) && rawData.length > 0) {
        return rawData.slice(0, 40).map(formatUniversity);
      }
    }
  } catch {
    // API request failed or offline -> fall back to popular list
  }

  // Fallback to pre-seeded popular universities if API is unreachable
  let list = [...POPULAR_UNIVERSITIES];

  if (country) {
    list = list.filter((u) => u.country.toLowerCase() === country.toLowerCase());
  }

  if (query) {
    const q = query.toLowerCase();
    list = list.filter((u) => u.name.toLowerCase().includes(q) || u.country.toLowerCase().includes(q));
  }

  return list;
}

export function getCountryFlag(countryName: string): string {
  return COUNTRY_FLAGS[countryName] || '🌐';
}
