import { NextRequest, NextResponse } from 'next/server';
import { getBills, getBillCount } from '@/lib/bulkData';
import type { Bill } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const session = searchParams.get('session') || undefined;
    const chamber = searchParams.get('chamber') || undefined;
    const status = searchParams.get('status') || undefined;
    const countOnly = searchParams.get('count_only') === 'true';

    // If only count is requested
    if (countOnly) {
      const count = await getBillCount({ session, chamber, status });
      return NextResponse.json({ count });
    }

    // Get bills with filters
    const bills = await getBills(limit, offset, {
      session,
      chamber,
      status
    });

    // Convert Supabase bills to our Bill type
    const convertedBills: Bill[] = bills.map((sb: any) => {
      const sponsorNames = sb.sponsors?.names || [];
      const subjects = sb.subject || [];
      
      return {
        id: String(sb.id),
        billNumber: String(sb.bill_number),
        title: String(sb.title),
        description: String(sb.description || ''),
        billType: 'bill' as const,
        status: String(sb.status) as any,
        sponsor: sponsorNames[0] || 'Unknown',
        coSponsors: sponsorNames.slice(1) || [],
        introducedDate: String(sb.created_at),
        lastActionDate: String(sb.updated_at),
        chamber: String(sb.chamber) as any,
        fiscalNote: sb.fiscal_note ? {
          id: 'temp-id',
          billId: String(sb.id),
          description: String(sb.fiscal_note),
          effectiveDate: String(sb.created_at),
          agency: 'Unknown',
          createdAt: String(sb.created_at)
        } : undefined,
        position: 'neutral' as any,
        client: null,
        notes: '',
        tags: subjects,
        createdAt: String(sb.created_at),
        updatedAt: String(sb.updated_at),
        progress: sb.actions ? Object.values(sb.actions).map((action: any, index: number) => ({
          id: `progress-${index}`,
          billId: String(sb.id),
          stage: action.classification?.[0] || 'unknown',
          date: action.date || String(sb.created_at),
          description: action.description || 'Action taken',
          chamber: sb.chamber
        })) : []
      };
    });

    return NextResponse.json({
      bills: convertedBills,
      pagination: {
        limit,
        offset,
        total: await getBillCount({ session, chamber, status })
      }
    });

  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bills' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters, searchParams } = body;

    // This would be for advanced filtering/searching
    // For now, just redirect to GET with query params
    const url = new URL('/api/bills', request.url);
    
    if (filters?.session) url.searchParams.set('session', filters.session);
    if (filters?.chamber) url.searchParams.set('chamber', filters.chamber);
    if (filters?.status) url.searchParams.set('status', filters.status);
    if (searchParams?.limit) url.searchParams.set('limit', searchParams.limit);
    if (searchParams?.offset) url.searchParams.set('offset', searchParams.offset);

    return NextResponse.redirect(url);

  } catch (error) {
    console.error('Error processing bill search:', error);
    return NextResponse.json(
      { error: 'Failed to process search' },
      { status: 500 }
    );
  }
}
