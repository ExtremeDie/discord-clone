import { NextResponse } from 'next/server';
import currentProfile from '../../../../lib/current-profile';
import { db } from '../../../../lib/db';

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
	try {
		const { serverId } = await params;
		const profile = await currentProfile();
		const { name, imageUrl } = await req.json();

		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		if (!serverId) {
			return new NextResponse('Server ID missing', { status: 400 });
		}

		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				name,
				imageUrl,
			},
		});

		return NextResponse.json(server);
	} catch (err) {
		console.log('SERVER_ID_PATCH', err);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
	try {
		const { serverId } = await params;
		const profile = await currentProfile();

		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		if (!serverId) {
			return new NextResponse('Server ID missing', { status: 400 });
		}

		const server = await db.server.delete({
			where: {
				id: serverId,
				profileId: profile.id,
			},
		});

		return NextResponse.json(server);
	} catch (err) {
		console.log('SERVER_ID_DELETE', err);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
