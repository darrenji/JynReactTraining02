Redux数据结构设计

	{
		users: {
			isAuhed,
			isFetching,
			error,
			authendId,
			[uid]: {
				lastUpdated,
				info: {
					name,
					uid,
					avatar,
				}
			}
		},
		modal:{
			duck,
			isOpen,
		},
		ducks:{
			[duckId]:{
				lastUpdated,
				info: {
					avatar,
					duckId,
					name,
					text,
					timestamp,
					uid
				}
			}
		},
		usersDucks:{
			isFetching,
			error,
			[uid]: {
				lastUpdated,
				duckIds:[duckId, duckId,duckId]
			}
		},
		likeCount: {
			[duckId]:0
		},
		usersLikes:{
			[duckId]:true
		},
		replies:{
			isFetching,
			error,
			[duckId]: {
				replies:{
					lastUpated,
					[replyId]:{
						name,
						comment,
						uid,
						timestamp,
						avatar
					}
				}
			}
		},
		listeners:{
			[listenersId]: true
		},
		feed: {
			isFetching,
			error,
			newDucksAvailable,
			duckIdsToAdd: [duckId, duckId],
			duckIds: [duckId, duckId]
		}
	}

<br>

state的设计

	var state = {
		ducks: {
			dxrhudsw:{
				uid: 'tylermcginnes',
				name: 'Tyler McGinnes',
				avatar: 'fb.com/tyler',
				duckId: '-dxrhudsw'
			},
			txdaqbhs: {
				uid: 'tylermcginnes',
				name: 'Tyler McGinnes',
				avatar: 'fb.com/tyler',
				text: 'Second duck',
				duckId: '-txdaqbhs'
			}
		},
		usersDucks: {
			tylermcginnes: ['dxrhudsw', 'txdaqbhs']
		}
	}
<br>

	//获取某个用户的所有ducks
	var ducks = state.usersDucks['tylermcginnes'].map((id) => state.ducks[id])