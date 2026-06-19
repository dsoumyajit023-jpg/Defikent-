
export const CITIES = {
  'West Bengal':      ['Kolkata','Howrah','Durgapur','Asansol','Siliguri','Kharagpur'],
  'Maharashtra':      ['Mumbai','Pune','Nagpur','Nashik','Aurangabad','Thane'],
  'Karnataka':        ['Bengaluru','Mysuru','Hubli','Mangaluru','Belagavi'],
  'Tamil Nadu':       ['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem'],
  'Delhi':            ['New Delhi','Dwarka','Noida','Gurgaon','Faridabad'],
  'Uttar Pradesh':    ['Lucknow','Kanpur','Varanasi','Agra','Prayagraj','Ghaziabad'],
  'Rajasthan':        ['Jaipur','Jodhpur','Udaipur','Kota','Bikaner'],
  'Gujarat':          ['Ahmedabad','Surat','Vadodara','Rajkot','Gandhinagar'],
  'Madhya Pradesh':   ['Bhopal','Indore','Gwalior','Jabalpur','Ujjain'],
  'Punjab':           ['Chandigarh','Ludhiana','Amritsar','Jalandhar','Patiala'],
  'Haryana':          ['Gurugram','Faridabad','Panipat','Ambala','Rohtak'],
  'Andhra Pradesh':   ['Visakhapatnam','Vijayawada','Guntur','Nellore','Tirupati'],
  'Telangana':        ['Hyderabad','Warangal','Nizamabad','Karimnagar'],
  'Kerala':           ['Thiruvananthapuram','Kochi','Kozhikode','Thrissur','Kollam'],
  'Bihar':            ['Patna','Gaya','Muzaffarpur','Bhagalpur'],
  'Odisha':           ['Bhubaneswar','Cuttack','Rourkela','Berhampur'],
  'Assam':            ['Guwahati','Silchar','Dibrugarh','Jorhat'],
  'Jharkhand':        ['Ranchi','Jamshedpur','Dhanbad','Bokaro'],
  'Chhattisgarh':     ['Raipur','Bhilai','Bilaspur','Korba'],
  'Goa':              ['Panaji','Margao','Vasco da Gama'],
  'Himachal Pradesh': ['Shimla','Manali','Dharamshala','Solan'],
  'Uttarakhand':      ['Dehradun','Haridwar','Rishikesh','Nainital'],
  'Chandigarh':       ['Chandigarh'],
  'J&K':              ['Jammu','Srinagar','Leh'],
};
export const STATES = Object.keys(CITIES);

// Unified vehicle list: bikes, scooters, cars, EVs
export const VEHICLE_LIST = [
  // ── Motorcycles ─────────────────────────────────────────────
  'Royal Enfield Classic 350','Royal Enfield Bullet 350','Royal Enfield Hunter 350',
  'Royal Enfield Meteor 350','Royal Enfield Himalayan','Royal Enfield Continental GT 650',
  'Royal Enfield Interceptor 650','Bajaj Pulsar NS160','Bajaj Pulsar NS200',
  'Bajaj Pulsar RS200','Bajaj Pulsar 150','Bajaj Dominar 400','Bajaj Dominar 250',
  'Bajaj Avenger Street 160','Bajaj Avenger Cruise 220','Bajaj CT100','Bajaj Platina 100',
  'Hero Splendor Plus','Hero HF Deluxe','Hero Passion Pro','Hero Glamour',
  'Hero Xtreme 160R','Hero Xpulse 200','Honda Shine','Honda Unicorn',
  'Honda Hornet 2.0','Honda CB300R','Honda CB350','Honda CB350RS',
  'TVS Apache RTR 160','TVS Apache RTR 200 4V','TVS Apache RR 310',
  'TVS Raider 125','TVS Star City Plus','TVS Ronin',
  'Suzuki Gixxer','Suzuki Gixxer SF','Suzuki Gixxer 250','Suzuki Gixxer SF 250',
  'KTM Duke 125','KTM Duke 200','KTM Duke 390','KTM RC 390','KTM Adventure 390',
  'Yamaha FZ-S','Yamaha FZ 25','Yamaha MT-15','Yamaha R15 V4','Yamaha FZX',
  'Kawasaki Z650','Kawasaki Ninja 400','Kawasaki Ninja 650','Kawasaki Z900',
  'Jawa 42','Jawa Perak','BMW G 310 R','BMW G 310 GS',
  'Hero Mavrick 440','Triumph Speed 400','Triumph Scrambler 400X',
  // ── Scooters ─────────────────────────────────────────────────
  'Honda Activa 6G','Honda Activa 125','Honda Dio','Honda Grazia',
  'TVS Jupiter','TVS NTorq 125','TVS Scooty Pep+','TVS iQube',
  'Suzuki Access 125','Suzuki Burgman Street',
  'Yamaha Fascino 125','Yamaha Ray-ZR 125',
  'Hero Destini 125','Hero Maestro Edge 125','Hero Pleasure+',
  'Bajaj Chetak','Ola S1 Pro','Ola S1 Air','Ather 450X','Ather 450 Plus',
  'Revolt RV400','Simple One',
  // ── Hatchbacks / Sedans ───────────────────────────────────────
  'Maruti Suzuki Alto K10','Maruti Suzuki Swift','Maruti Suzuki Baleno',
  'Maruti Suzuki Dzire','Maruti Suzuki Wagon R','Maruti Suzuki Celerio',
  'Maruti Suzuki Ignis','Hyundai i10 Nios','Hyundai i20',
  'Hyundai Aura','Hyundai Verna','Tata Tiago','Tata Tigor',
  'Tata Altroz','Honda Amaze','Honda City',
  'Volkswagen Polo','Volkswagen Vento','Skoda Slavia',
  'Renault Kwid','Renault Triber','Nissan Magnite',
  // ── SUVs / Crossovers ─────────────────────────────────────────
  'Maruti Suzuki Brezza','Maruti Suzuki Ertiga','Maruti Suzuki Grand Vitara',
  'Hyundai Creta','Hyundai Venue','Hyundai Tucson',
  'Kia Seltos','Kia Sonet','Kia Carens',
  'Tata Nexon','Tata Punch','Tata Harrier','Tata Safari',
  'Mahindra Scorpio-N','Mahindra XUV700','Mahindra XUV300','Mahindra Thar',
  'Toyota Fortuner','Toyota Innova Crysta','Toyota Urban Cruiser Hyryder',
  'MG Hector','MG Astor','MG Comet EV',
  // ── Electric Cars ─────────────────────────────────────────────
  'Tata Nexon EV','Tata Tiago EV','Tata Punch EV',
  'Hyundai Ioniq 5','Kia EV6','BYD Atto 3',
  'MG ZS EV','Citroen eC3','Mahindra XUV400',
];

// Keep BIKE_LIST as alias for backward compatibility
export const BIKE_LIST = VEHICLE_LIST;
