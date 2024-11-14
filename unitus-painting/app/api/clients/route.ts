import { NextResponse } from 'next/server';
import { getClientContent, updateClientContent, deleteClient, reorderClients } from '@/lib/db/init-clients';
import { ClientContent } from '@/lib/db/init-clients';

// Force dynamic route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  console.log('📡 API: GET /api/clients - Request received');
  try {
    const content = await getClientContent();
    console.log('✅ API: GET /api/clients - Success:', content);
    return NextResponse.json(content);
  } catch (error) {
    console.error('❌ API: GET /api/clients - Error:', error);
    return NextResponse.json(
      { error: 'Failed to read clients' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  console.log('📡 API: POST /api/clients - Request received');
  try {
    const content: ClientContent = await req.json();
    console.log('📦 API: POST /api/clients - Received content:', content);
    const updatedContent = await updateClientContent(content);
    console.log('✅ API: POST /api/clients - Success:', updatedContent);
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('❌ API: POST /api/clients - Error:', error);
    return NextResponse.json(
      { error: 'Failed to save clients' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  console.log('📡 API: PUT /api/clients - Request received');
  try {
    const content: ClientContent = await req.json();
    console.log('📦 API: PUT /api/clients - Received content:', content);
    const updatedContent = await updateClientContent(content);
    console.log('✅ API: PUT /api/clients - Success:', updatedContent);
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('❌ API: PUT /api/clients - Error:', error);
    return NextResponse.json(
      { error: 'Failed to update clients' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  console.log('📡 API: DELETE /api/clients - Request received');
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log('📦 API: DELETE /api/clients - Client ID:', id);

    if (!id) {
      console.error('❌ API: DELETE /api/clients - No ID provided');
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    await deleteClient(parseInt(id));
    console.log('✅ API: DELETE /api/clients - Success: Client deleted', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ API: DELETE /api/clients - Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  console.log('📡 API: PATCH /api/clients - Request received');
  try {
    const { clientIds }: { clientIds: number[] } = await req.json();
    console.log('📦 API: PATCH /api/clients - Received client IDs:', clientIds);

    if (!Array.isArray(clientIds)) {
      console.error('❌ API: PATCH /api/clients - Invalid client IDs format');
      return NextResponse.json(
        { error: 'Client IDs array is required' },
        { status: 400 }
      );
    }

    await reorderClients(clientIds);
    console.log('✅ API: PATCH /api/clients - Success: Clients reordered');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ API: PATCH /api/clients - Error:', error);
    return NextResponse.json(
      { error: 'Failed to reorder clients' },
      { status: 500 }
    );
  }
}