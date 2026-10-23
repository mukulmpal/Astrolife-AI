import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all charts for this user, ordered by creation date
    const { data, error } = await supabase
      .from('user_charts')
      .select('id, name, dob, tob, city, country, created_at, is_default')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      charts: data || [],
    });
  } catch (err) {
    console.error('Error fetching charts:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch charts' },
      { status: 500 }
    );
  }
}
