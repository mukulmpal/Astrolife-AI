import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      name,
      dob,
      tob,
      city,
      country,
      timezone,
      latitude,
      longitude,
      chartData,
      engines, // Data from all engines (yogas, dasha, etc.)
    } = await req.json();

    // Save to user_charts table
    const { data, error } = await supabase
      .from('user_charts')
      .insert({
        user_id: user.id,
        name,
        dob,
        tob,
        city,
        country,
        timezone,
        latitude,
        longitude,
        chart_data: chartData,
        engines_data: engines, // Store all engine calculations
        created_at: new Date().toISOString(),
        is_default: false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      id: data.id,
      message: 'Chart saved successfully',
    });
  } catch (err) {
    console.error('Error saving chart:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save chart' },
      { status: 500 }
    );
  }
}
