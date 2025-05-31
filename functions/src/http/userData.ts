import type { Request, Response } from 'express';
import { getApp } from 'firebase-admin/app';
const app = getApp();

// authの利用
// import { getAuth } from 'firebase-admin/auth';
// const auth = getAuth(app);

// firestoreの利用
import { getFirestore } from 'firebase-admin/firestore';
const db = getFirestore(app);



async function getUserData(req: Request, res: Response) {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'ユーザー認証が必要です。' });
        }

        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(200).json({
                setting: {
                    timeLimitPresentation: true,
                    BGM: true,
                    typingSound: true,
                    otherSoundEffect: true
                },
                records: {
                    totalTypeByte: 0,
                    bestWPM: 0
                }
            });
        }

        return res.status(200).json(userDoc.data());
    } catch (error) {
        console.error('ユーザーデータの取得エラー:', error);
        return res.status(500).json({ error: 'ユーザーデータの取得に失敗しました。' });
    }
}

async function setUserData(req: Request, res: Response) {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'ユーザー認証が必要です。' });
        }
        
        const { setting, records } = req.body;

        const updateData: any = {};

        if (setting) {
            updateData.setting = setting;
        }

        if (records) {
            updateData.records = records;
        }

        await db.collection('users').doc(userId).set(updateData, { merge: true });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('ユーザーデータの更新エラー:', error);
        return res.status(500).json({ error: 'ユーザーデータの更新に失敗しました。' });
    }    
}

async function addGameRecord(req: Request, res: Response) {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'ユーザー認証が必要です。' });
        }

        const gameRecord = req.body;

        const recordWithTimestamp = {
            ...gameRecord,
            recordedAt: new Date()
        };

        const recordRef = await db.collection('users').doc(userId).collection('gameRecords').add(recordWithTimestamp);

        const userRef = db.collection('users').doc(userId);
        let totalTypeByte, bestWPM;

        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            const userData = userDoc.data() || {};
            const currentRecords = userData.records || { totalTypeByte: 0, bestWPM: 0 };

            totalTypeByte = (currentRecords.totalTypeByte || 0) + gameRecord.correctTypeByte;
            const byte = gameRecord.correctTypeByte;
            bestWPM = Math.max(currentRecords.bestWPM || 0, byte);

            transaction.set(userRef, {
                records: {
                    totalTypeByte,
                    bestWPM
                }
            }, { merge: true });
        });

        return res.status(200).json({
            success: true,
            recordId: recordRef.id,
            totalTypeByte,
            bestWPM
        });
    } catch (error) {
        console.error('ゲーム記録の追加エラー:', error);
        return res.status(500).json({ error: 'ゲーム記録の追加に失敗しました。' });
    }
}

async function getLatestGameRecords(req: Request, res: Response) {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'ユーザー認証が必要です。' });
        }

        const recordsSnapshot = await db.collection('users').doc(userId).collection('gameRecords')
            .orderBy('recordedAt', 'desc')
            .limit(1)
            .get();

        if (recordsSnapshot.empty) {
            return res.status(404).json({ error: 'ゲーム記録が見つかりません。' });
        }
        
        const latestRecord = recordsSnapshot.docs[0].data();
        return res.status(200).json(latestRecord);
    } catch (error) {
        console.error('最新のゲーム記録の取得エラー:', error);
        return res.status(500).json({ error: '最新のゲーム記録の取得に失敗しました。' });
    }
}



export {getUserData, setUserData, addGameRecord, getLatestGameRecords};