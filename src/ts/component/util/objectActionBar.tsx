import React, { useState, useRef, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Icon, IconObject } from 'Component';
import { I, C, S, U, translate, analytics } from 'Lib';
import CommentForm from 'Component/comment/form';
import { renderParts } from 'Component/comment/render';

interface Props {
	rootId: string;
	readonly?: boolean;
	commentCount?: number;
};

const ObjectActionBar = observer((props: Props) => {

	const { rootId, readonly, commentCount } = props;
	const targetType = I.CommentTargetType.Object;
	const object = S.Detail.get(rootId, rootId, [ 'discussionId' ]);
	const [ localDiscussionId, setLocalDiscussionId ] = useState('');
	const [ isCommentOpen, setIsCommentOpen ] = useState(false);
	const [ reactions, setReactions ] = useState<string[]>([]);
	const [ lastPost, setLastPost ] = useState<{ parts: I.CommentContentPart[], sentAt: number } | null>(null);
	const { account } = S.Auth;
	const { space } = S.Common;
	const participant = U.Space.getParticipant(U.Space.getParticipantId(space, account?.id));
	const discussionId = object.discussionId || localDiscussionId || '';
	const subId = U.Comment.getSubId(targetType, discussionId || rootId);
	const formRef = useRef<any>(null);
	const isCreating = useRef(false);

	const ensureDiscussion = useCallback((callBack: (id: string) => void) => {
		if (discussionId) {
			callBack(discussionId);
			return;
		};

		if (isCreating.current) {
			return;
		};

		isCreating.current = true;

		C.ObjectAddDiscussion(rootId, (message: any) => {
			isCreating.current = false;

			let id = message.discussionId;

			if (message.error.code) {
				const obj = S.Detail.get(rootId, rootId, [ 'discussionId' ]);
				id = obj.discussionId;

				if (!id) {
					return;
				};
			};

			setLocalDiscussionId(id);
			callBack(id);
		});
	}, [ rootId, discussionId ]);

	const getCommentAnalyticsData = useCallback((parts: I.CommentContentPart[]) => {
		const hasMention = parts.some(p => (p.marks || []).some(m => m.type === I.MarkType.Mention));
		const hasAttachments = parts.some(p => (p.type === I.BlockType.Link) || (p.type === I.BlockType.Embed));
		return { hasMention, hasAttachments };
	}, []);

	const onSubmitPost = useCallback((parts: I.CommentContentPart[], messageAttachments?: I.ChatMessageAttachment[], attachmentObjects?: any[]) => {
		const blocks = U.Comment.partsToBlocks(parts);
		const { account } = S.Auth;

		const msg = {
			replyToMessageId: '',
			content: {
				text: '',
				style: I.TextStyle.Paragraph,
				marks: [],
			},
			blocks,
			attachments: messageAttachments || [],
			reactions: [],
		};

		ensureDiscussion((id: string) => {
			const sid = U.Comment.getSubId(targetType, id);

			if (attachmentObjects?.length) {
				for (const obj of attachmentObjects) {
					S.Detail.update(sid, { id: obj.id, details: obj }, false);
				};
			};

			const isFirstPost = !S.Comment.getPosts(sid).length;

			C.ChatAddMessage(id, msg as any, (response: any) => {
				if (response.error.code) {
					return;
				};

				const analyticsData = getCommentAnalyticsData(parts);

				if (isFirstPost) {
					analytics.event('StartDiscussion', analyticsData);
				};

				analytics.event('PostDiscussion', analyticsData);

				const newPost = {
					id: response.messageId,
					orderId: response.orderId,
					creator: account.id,
					createdAt: U.Date.now(),
					modifiedAt: 0,
					replyToMessageId: '',
					content: {
						text: '',
						style: I.TextStyle.Paragraph,
						marks: [],
						parts,
					},
					attachments: messageAttachments || [],
					reactions: [],
					isSynced: false,
					replyCount: 0,
				};

				S.Comment.addPost(sid, newPost as any);
				formRef.current?.clear();
				setLastPost({ parts, sentAt: newPost.createdAt });
			});
		});
	}, [ discussionId, subId, ensureDiscussion, getCommentAnalyticsData ]);

	const onForwardClick = () => {
		S.Menu.open('searchObject', {
			element: '#button-action-forward',
			horizontal: I.MenuDirection.Center,
			data: {
				filters: [
					{ relationKey: 'resolvedLayout', condition: I.FilterCondition.In, value: U.Object.getPageLayouts() },
				],
				rootId,
				canAdd: true,
				onSelect: () => S.Menu.close('searchObject'),
			},
		});
	};

	const onReactionClick = () => {
		S.Menu.open('smile', {
			element: '#button-action-reaction',
			horizontal: I.MenuDirection.Center,
			noFlipX: true,
			data: {
				noHead: true,
				noUpload: true,
				value: '',
				onSelect: (icon: string) => {
					setReactions(prev => (prev.includes(icon) ? prev.filter(r => r !== icon) : [ ...prev, icon ]));
					S.Menu.close('smile');
				},
				route: analytics.route.reaction,
			},
		});
	};

	return (
		<div className="objectActionBar">
			<div className="actionButtons">
				<div className="commentButton" onClick={() => { setIsCommentOpen(true); window.setTimeout(() => formRef.current?.focus(), 50); }}>
					<Icon className="chat" id="button-action-comment" onDoubleClick={e => e.stopPropagation()} />
					<span className="commentCount">{commentCount ?? 0}</span>
				</div>
				{reactions.length ? <div className="actionDivider" /> : ''}
				{reactions.map(icon => (
					<div key={icon} className="reactionButton" onClick={() => setReactions(prev => prev.filter(r => r !== icon))}>
						<IconObject object={{ iconEmoji: icon }} size={18} />
						<IconObject object={participant} size={18} />
					</div>
				))}
				<Icon
					className="reaction0"
					id="button-action-reaction"
					onClick={onReactionClick}
					onDoubleClick={e => e.stopPropagation()}
					tooltipParam={{ text: translate('commonReaction'), typeY: I.MenuDirection.Bottom }}
				/>
				<div className="spacer" />
				<Icon
					className="forward"
					id="button-action-forward"
					onClick={onForwardClick}
					onDoubleClick={e => e.stopPropagation()}
					tooltipParam={{ text: translate('commonForward'), typeY: I.MenuDirection.Bottom }}
				/>
			</div>
			{isCommentOpen ? (
		<>
			<div className="commentDivider" />
			{lastPost ? (
				<div className="lastPostPreview">
					<div className="postHead">
						<IconObject object={participant} size={20} />
						<span className="author">{participant?.name}</span>
						<span className="time">{U.Date.date('H:i', lastPost.sentAt)}</span>
					</div>
					<div className="content">
						{renderParts(lastPost.parts, subId)}
					</div>
				</div>
			) : ''}
			<div className="commentFormWrap">
				<CommentForm
					ref={formRef}
					rootId={rootId}
					subId={subId}
					readonly={readonly}
					isExpanded={true}
					onSubmit={onSubmitPost}
					onResize={() => {}}
				/>
			</div>
		</>
		) : ''}
		</div>
	);

});

export default ObjectActionBar;
