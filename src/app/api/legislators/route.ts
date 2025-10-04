import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import type { Legislator } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const party = searchParams.get('party') || undefined;
    const chamber = searchParams.get('chamber') || undefined;
    const district = searchParams.get('district') || undefined;

    // Build Supabase query
    let query = supabase
      .from('legislators')
      .select('*')
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (party) {
      query = query.eq('party', party);
    }
    if (chamber) {
      query = query.eq('chamber', chamber);
    }
    if (district) {
      query = query.eq('district', district);
    }

    const { data: legislators, error, count } = await query;

    if (error) throw error;

    // Convert Supabase legislators to our Legislator type
    const convertedLegislators: Legislator[] = (legislators || []).map((leg: Record<string, unknown>) => ({
      id: String(leg.id),
      fullName: String(leg.name),
      firstName: String(leg.first_name || ''),
      lastName: String(leg.last_name || ''),
      party: String(leg.party || 'unknown'),
      chamber: String(leg.chamber) as 'house' | 'senate',
      district: String(leg.district || ''),
      email: String(leg.email || ''),
      phone: String(leg.phone || ''),
      office: String(leg.office || ''),
      profileImage: String(leg.profile_image || ''),
      bio: String(leg.bio || ''),
      committees: leg.committees || [],
      leadership: leg.leadership || [],
      socialMedia: leg.social_media || {},
      votingRecord: {
        totalVotes: leg.total_votes || 0,
        partyUnity: leg.party_unity || 0,
        missedVotes: leg.missed_votes || 0
      },
      psychographics: {
        ideology: String(leg.ideology || 'moderate'),
        priorities: leg.priorities || [],
        relationships: leg.relationships || {},
        communicationStyle: String(leg.communication_style || 'formal')
      },
      districtInfo: {
        population: leg.district_population || 0,
        demographics: leg.district_demographics || {},
        keyIssues: leg.district_key_issues || [],
        economicProfile: leg.economic_profile || {}
      },
      createdAt: String(leg.created_at),
      updatedAt: String(leg.updated_at)
    }));

    return NextResponse.json({
      legislators: convertedLegislators,
      pagination: {
        limit,
        offset,
        total: count || 0
      }
    });

  } catch (error) {
    console.error('Error fetching legislators:', error);
    
    // Return empty result instead of error for now
    const { searchParams } = new URL(request.url);
    return NextResponse.json({
      legislators: [],
      pagination: {
        limit: parseInt(searchParams.get('limit') || '50'),
        offset: parseInt(searchParams.get('offset') || '0'),
        total: 0
      }
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters, searchParams } = body;

    // This would be for advanced filtering/searching
    // For now, just redirect to GET with query params
    const url = new URL('/api/legislators', request.url);
    
    if (filters?.party) url.searchParams.set('party', filters.party);
    if (filters?.chamber) url.searchParams.set('chamber', filters.chamber);
    if (filters?.district) url.searchParams.set('district', filters.district);
    if (searchParams?.limit) url.searchParams.set('limit', searchParams.limit);
    if (searchParams?.offset) url.searchParams.set('offset', searchParams.offset);

    return NextResponse.redirect(url);

  } catch (error) {
    console.error('Error processing legislator search:', error);
    return NextResponse.json(
      { error: 'Failed to process search' },
      { status: 500 }
    );
  }
}
