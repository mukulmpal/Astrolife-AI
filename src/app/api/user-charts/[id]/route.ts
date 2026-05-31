import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_charts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      chart: data,
    });
  } catch (err) {
    console.error('Error fetching chart:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch chart' },
      { status: 500 }
    );
  }
}

// Delete a chart
export async function DELETE(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('user_charts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Chart deleted',
    });
  } catch (err) {
    console.error('Error deleting chart:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete chart' },
      { status: 500 }
    );
  }
}
