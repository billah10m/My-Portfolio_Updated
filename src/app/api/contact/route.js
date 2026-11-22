import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const MESSAGES_FILE = path.join(process.cwd(), 'src', 'data', 'messages.json');

function getMessages() {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {
    // fallback empty array
  }
  return [];
}

function saveMessages(msgs) {
  try {
    const dir = path.dirname(MESSAGES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const msgs = getMessages();
  return NextResponse.json({ success: true, data: msgs });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, category, contactMethod, interests } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Name, email, and message are required' }, { status: 400 });
    }

    const newMsg = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      email: email.trim(),
      subject: (subject || category || 'General Inquiry').trim(),
      category: category || 'General',
      contactMethod: contactMethod || 'Email',
      interests: interests || [],
      message: message.trim(),
      created_at: new Date().toISOString(),
      is_read: false
    };

    const msgs = getMessages();
    msgs.unshift(newMsg);
    saveMessages(msgs);

    return NextResponse.json({
      success: true,
      message: 'Your transmission has been securely received by Asif Billah.',
      data: newMsg
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Message ID is required' }, { status: 400 });
    }

    const msgs = getMessages();
    const filtered = msgs.filter(m => m.id !== id);
    saveMessages(filtered);

    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
