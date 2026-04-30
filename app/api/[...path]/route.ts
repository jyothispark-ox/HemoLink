import { NextResponse } from 'next/server';

let db = {
  users: [
    { id: '1', name: 'Admin User', email: 'admin@hemolink.com', password: 'password123' }
  ],
  donors: [
    { id: '1', name: 'John Doe', age: 30, blood_group: 'O+', contact: '555-0101' },
    { id: '2', name: 'Jane Smith', age: 25, blood_group: 'A-', contact: '555-0202' }
  ],
  patients: [
    { id: '1', name: 'Mark Johnson', blood_group: 'AB+', condition_info: 'Surgery' },
    { id: '2', name: 'Emily Davis', blood_group: 'O-', condition_info: 'Anemia' }
  ],
  requests: [
    { id: '1', patient_id: '1', blood_group: 'AB+', units: 2, status: 'Pending' },
    { id: '2', patient_id: '2', blood_group: 'O-', units: 1, status: 'Approved' }
  ],
  donations: [
    { id: '1', donor_id: '1', quantity: 1, date: new Date().toISOString() }
  ],
  stock: {
    'A+': 10, 'A-': 5, 'B+': 12, 'B-': 3, 'AB+': 4, 'AB-': 1, 'O+': 20, 'O-': 5
  }
};

const getPath = (req: Request) => new URL(req.url).pathname.replace('/api/', '');

export async function GET(req: Request) {
  const path = getPath(req);
  if (path === 'donors') return NextResponse.json(db.donors);
  if (path === 'patients') return NextResponse.json(db.patients);
  if (path === 'donations') return NextResponse.json(db.donations);
  if (path === 'requests') return NextResponse.json(db.requests);
  if (path === 'blood_stock') return NextResponse.json(db.stock);

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(req: Request) {
  const path = getPath(req);
  const body = await req.json();
  const id = Date.now().toString();

  if (path === 'login') {
    const user = db.users.find(u => u.email === body.email && u.password === body.password);
    if (user) return NextResponse.json({ token: 'mock-jwt-token', user: { id: user.id, name: user.name, email: user.email } });
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  if (path === 'users') {
    const newUser = { id, ...body };
    db.users.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
  }

  if (path === 'donors') {
    const newDonor = { id, ...body };
    db.donors.push(newDonor);
    return NextResponse.json(newDonor, { status: 201 });
  }

  if (path === 'patients') {
    const newPatient = { id, ...body };
    db.patients.push(newPatient);
    return NextResponse.json(newPatient, { status: 201 });
  }

  if (path === 'requests') {
    const newRequest = { id, status: 'Pending', ...body };
    db.requests.push(newRequest);
    return NextResponse.json(newRequest, { status: 201 });
  }

  if (path === 'donations') {
    const newDonation = { id, date: new Date().toISOString(), ...body };
    db.donations.push(newDonation);
    
    // Increase stock
    const donor = db.donors.find(d => d.id === body.donor_id);
    if (donor) {
      db.stock[donor.blood_group as keyof typeof db.stock] = (db.stock[donor.blood_group as keyof typeof db.stock] || 0) + Number(body.quantity);
    }
    return NextResponse.json(newDonation, { status: 201 });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(req: Request) {
  const pathParts = getPath(req).split('/');
  
  if (pathParts[0] === 'requests' && pathParts[1]) {
    const id = pathParts[1];
    const body = await req.json();
    const reqIndex = db.requests.findIndex(r => r.id === id);
    
    if (reqIndex > -1) {
      const request = db.requests[reqIndex];
      const newStatus = body.status;
      
      if (newStatus === 'Approved' && request.status !== 'Approved') {
        // Decrease stock
        const currentStock = db.stock[request.blood_group as keyof typeof db.stock] || 0;
        if (currentStock < request.units) {
          return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
        }
        db.stock[request.blood_group as keyof typeof db.stock] = currentStock - request.units;
      }
      
      db.requests[reqIndex] = { ...request, ...body };
      return NextResponse.json(db.requests[reqIndex]);
    }
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
