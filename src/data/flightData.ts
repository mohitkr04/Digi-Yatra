export const ROUTES = {
  'DEL-HYD': {
    distance: '1253 km',
    minDuration: 110, // 1hr 50min in minutes
    maxDuration: 480, // 8hrs in minutes
    basePrice: 7000
  },
  'HYD-DEL': {
    distance: '1253 km',
    minDuration: 110,
    maxDuration: 480,
    basePrice: 7000
  },
  'DEL-BOM': {
    distance: '1148 km',
    minDuration: 90, // 1hr 30min in minutes
    maxDuration: 420, // 7hrs in minutes
    basePrice: 6500
  },
  'BOM-DEL': {
    distance: '1148 km',
    minDuration: 90,
    maxDuration: 420,
    basePrice: 6500
  },
  'HYD-BOM': {
    distance: '631 km',
    minDuration: 70, // 1hr 10min in minutes
    maxDuration: 360, // 6hrs in minutes
    basePrice: 5500
  },
  'BOM-HYD': {
    distance: '631 km',
    minDuration: 70,
    maxDuration: 360,
    basePrice: 5500
  }
};

export const AIRLINES = [
  {
    code: 'SG',
    name: 'SpiceJet',
    logo: '/Spicejet.png',
    primaryColor: '#ff5722'
  },
  {
    code: '6E',
    name: 'IndiGo',
    logo: '/Indigo.jpeg',
    primaryColor: '#0a4894'
  },
  {
    code: 'QP',
    name: 'Akasa Air',
    logo: '/Akasa Air.png',
    primaryColor: '#ff6b6b'
  },
  {
    code: 'AI',
    name: 'Air India',
    logo: '/Air India.jpeg',
    primaryColor: '#e31837'
  }
];

// Add this interface for better type safety
export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  logo: string;
  flightNumber: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  type: string;
  price: number;
  seatsAvailable: number;
  terminal: string;
  gate: string;
  specialOffer?: {
    tag: string;
    originalPrice: number;
  };
}

// Add utility functions for time handling
const getCurrentTime = () => {
  const now = new Date();
  return {
    hours: now.getHours(),
    minutes: now.getMinutes()
  };
};

const formatTime = (hours: number, minutes: number) => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}hr ${mins}min`;
};

// Add function to generate random duration based on flight type
const generateDuration = (route: typeof ROUTES[keyof typeof ROUTES], isNonStop: boolean): {
  duration: string;
  durationInMinutes: number;
} => {
  let durationInMinutes: number;
  
  if (isNonStop) {
    // Non-stop flights: Use duration close to minimum
    durationInMinutes = route.minDuration + Math.floor(Math.random() * 30); // Add 0-30 minutes for variations
  } else {
    // Flights with stops: Use longer durations
    const minWithStops = route.minDuration + 90; // Minimum 1.5 hours extra for stops
    durationInMinutes = minWithStops + Math.floor(Math.random() * (route.maxDuration - minWithStops));
  }
  
  return {
    duration: formatDuration(durationInMinutes),
    durationInMinutes
  };
};

// Update the flight generation function
export const generateFlightSchedules = (from: string, to: string, date: string) => {
  const routeKey = `${from}-${to}` as keyof typeof ROUTES;
  const route = ROUTES[routeKey];
  
  if (!route) {
    return [];
  }

  const currentTime = getCurrentTime();
  const selectedDate = new Date(date);
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  // Generate time slots starting from current time if it's today
  const generateTimeSlots = () => {
    const slots = [];
    let baseHour = isToday ? currentTime.hours : 6;
    let baseMinute = isToday ? Math.ceil(currentTime.minutes / 15) * 15 : 0;

    for (let i = 0; i < 8; i++) {
      const depTime = formatTime(baseHour, baseMinute);
      const isNonStop = Math.random() > 0.3; // 70% chance of non-stop flights
      const { duration, durationInMinutes } = generateDuration(route, isNonStop);
      
      // Calculate arrival time based on duration
      const arrivalMinutes = baseHour * 60 + baseMinute + durationInMinutes;
      const arrHour = Math.floor(arrivalMinutes / 60) % 24;
      const arrMinute = arrivalMinutes % 60;
      const arrTime = formatTime(arrHour, arrMinute);
      
      slots.push({ 
        dep: depTime, 
        arr: arrTime,
        duration,
        type: isNonStop ? 'Non Stop' : `${Math.floor(Math.random() * 2) + 1} Stop`
      });

      // Increment by 1-2 hours randomly
      baseMinute += Math.floor(Math.random() * 60);
      baseHour += 1 + Math.floor(Math.random() * 2);
      
      if (baseHour >= 24) break;
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Generate flights with the new duration logic
  const flights = AIRLINES.flatMap((airline) => {
    return timeSlots.map((slot, slotIndex) => {
      const basePrice = Math.floor(
        route.basePrice + (Math.random() * 2000) + 
        (slotIndex * 100) + 
        (slot.type === 'Non Stop' ? 0 : 1000) // Add premium for non-stop flights
      );

      return {
        id: `${airline.code}-${date}-${slotIndex}`,
        airline: airline.name,
        airlineCode: airline.code,
        logo: airline.logo,
        flightNumber: `${airline.code} ${100 + slotIndex}`,
        from,
        to,
        date,
        departureTime: slot.dep,
        arrivalTime: slot.arr,
        duration: slot.duration,
        type: slot.type,
        price: Math.round(basePrice / 100) * 100,
        seatsAvailable: Math.floor(Math.random() * 30) + 1,
        terminal: ['T1', 'T2', 'T3'][Math.floor(Math.random() * 3)],
        gate: `${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}${Math.floor(Math.random() * 20) + 1}`
      };
    });
  });

  // Add special offers
  const numberOfSpecialOffers = Math.floor(Math.random() * 2) + 2;
  const specialOfferIndices = new Set<number>();
  
  while (specialOfferIndices.size < numberOfSpecialOffers) {
    specialOfferIndices.add(Math.floor(Math.random() * flights.length));
  }

  specialOfferIndices.forEach(index => {
    const originalPrice = flights[index].price;
    flights[index].price = Math.floor(4000 + (Math.random() * 1000));
    (flights[index] as any)['specialOffer'] = {
      tag: getSpecialOfferTag(),
      originalPrice
    };
  });

  // Sort by departure time and then by price
  return flights.sort((a, b) => {
    const timeA = a.departureTime.replace(':', '');
    const timeB = b.departureTime.replace(':', '');
    if (timeA === timeB) {
      return a.price - b.price;
    }
    return timeA.localeCompare(timeB);
  });
};

// Helper function to generate random special offer tags
const getSpecialOfferTag = (): string => {
  const tags = [
    "Limited Time Deal! 🔥",
    "Flash Sale! ⚡",
    "Early Bird Offer! 🌅",
    "Last Minute Deal! ⏰",
    "Special Discount! 💫"
  ];
  return tags[Math.floor(Math.random() * tags.length)];
}; 