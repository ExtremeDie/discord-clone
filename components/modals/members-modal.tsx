'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { useState } from 'react';
import { useModal } from '../../hooks/use-modal-store';
import { MemberRole, ServerWithMembersWithProfiles } from '../../types';
import { ScrollArea } from '../ui/scroll-area';
import UserAvatar from '../user-avatar';
import qs from 'query-string';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuTrigger, DropdownMenuSubTrigger } from '../ui/dropdown-menu';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const roleIconMap: { [key in MemberRole]: JSX.Element | null } = {
	GUEST: null,
	MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
	ADMIN: <ShieldAlert className="w-4 h-4 text-rose-500" />,
};

export const MembersModal = () => {
	const router = useRouter();
	const { onOpen, isOpen, onClose, type, data } = useModal();

	const [loadingId, setLoadingId] = useState('');

	const isModalOpen = isOpen && type === 'members';
	const { server } = data as {
		server: ServerWithMembersWithProfiles;
	};

	const onKick = async (memberId: string) => {
		try {
			setLoadingId(memberId);
			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: {
					serverId: server?.id,
				},
			});

			const response = await axios.delete(url);

			router.refresh();
			onOpen('members', { server: response.data });
		} catch (err) {
			console.log(err);
		} finally {
			setLoadingId('');
		}
	};

	const onRoleChange = async (memberId: string, role: MemberRole) => {
		try {
			setLoadingId(memberId);
			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: {
					serverId: server?.id,
				},
			});

			const response = await axios.patch(url, {
				role,
			});

			router.refresh();
			onOpen('members', { server: response.data });
		} catch (err) {
			console.log(err);
		} finally {
			setLoadingId('');
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="overflow-hidden text-black bg-white">
				<DialogHeader className="px-6 pt-8">
					<DialogTitle className="text-2xl text-center text-bold">Manage Members</DialogTitle>
					<DialogDescription className="text-center text-zinc-500 ">{server?.members.length} Members</DialogDescription>
				</DialogHeader>
				<ScrollArea className="mt-8 max-h-[420px] pr-6">
					{server?.members?.map((member) => (
						<div key={member.id} className="flex items-center mb-6 gap-x-2">
							<UserAvatar src={member.profile.imageUrl} />
							<div className="flex flex-col gap-y-1">
								<div className="flex items-center text-xs font-semibold">
									{member.profile.name}
									{roleIconMap[member.role as MemberRole]}
								</div>
								<p className="text-xs text-zinc-500">{member.profile.email}</p>
							</div>
							{server.profileId !== member.profileId && loadingId !== member.id && (
								<div className="ml-auto">
									<DropdownMenu>
										<DropdownMenuTrigger>
											<MoreVertical className="w-4 h-4 text-zinc-500" />
										</DropdownMenuTrigger>
										<DropdownMenuContent side="left">
											<DropdownMenuSub>
												<DropdownMenuSubTrigger className="flex items-center">
													<ShieldQuestion className="w-4 h-4 mr-2" />
													<span>Role</span>
												</DropdownMenuSubTrigger>
												<DropdownMenuPortal>
													<DropdownMenuSubContent>
														<DropdownMenuItem onClick={() => onRoleChange(member.id, MemberRole.GUEST)}>
															<Shield className="w-4 h-4 mr-2" />
															Guest
															{member.role === MemberRole.GUEST && <Check className="w-4 h-4 ml-auto" />}
														</DropdownMenuItem>
														<DropdownMenuItem onClick={() => onRoleChange(member.id, MemberRole.MODERATOR)}>
															<Shield className="w-4 h-4 mr-2" />
															Moderator
															{member.role === MemberRole.MODERATOR && <Check className="w-4 h-4 ml-auto" />}
														</DropdownMenuItem>
													</DropdownMenuSubContent>
												</DropdownMenuPortal>
											</DropdownMenuSub>
											<DropdownMenuSeparator />
											<DropdownMenuItem onClick={() => onKick(member.id)}>
												<Gavel className="w-4 h-4 mr-2" />
												Kick
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							)}
							{loadingId === member.id && <Loader2 className="w-4 h-4 ml-auto animate-spin text-zinc-500" />}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
