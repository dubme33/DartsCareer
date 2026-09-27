const PLAYER_NICKNAME_MAX_LENGTH = 48;
const PLAYER_NICKNAMES_BY_NAME = new Map();

function normalizePlayerNickname(value) {
    return typeof value === 'string'
        ? Array.from(value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().replace(/\s+/g, ' ')).slice(0, PLAYER_NICKNAME_MAX_LENGTH).join('')
        : '';
}

function getPlayerNicknameIdentity(name) {
    return String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/gi, 'l')
        .toLowerCase().replace(/[^a-z0-9]/g, '');
}

if (typeof PLAYER_NICKNAME_ENTRIES !== 'undefined') {
    PLAYER_NICKNAME_ENTRIES.forEach(([baseName, realName, nickname]) => {
        for (const name of [baseName, realName]) PLAYER_NICKNAMES_BY_NAME.set(getPlayerNicknameIdentity(name), nickname);
    });
}

function getPlayerNickname(candidate) {
    if (!candidate) return '';
    // An explicit empty value is an intentional choice to have no nickname.
    if (Object.hasOwn(candidate, 'nickname')) return normalizePlayerNickname(candidate.nickname);
    if (Object.hasOwn(candidate, 'nickName')) return normalizePlayerNickname(candidate.nickName);
    if (candidate.isNewgen || candidate.editorCreated) return '';
    if (typeof player !== 'undefined' && candidate === player
        && !candidate.sourceName && !Number.isInteger(candidate.defaultTemplateIndex)) return '';
    return PLAYER_NICKNAMES_BY_NAME.get(getPlayerNicknameIdentity(candidate.sourceName))
        || PLAYER_NICKNAMES_BY_NAME.get(getPlayerNicknameIdentity(candidate.name)) || '';
}

function initializePlayerNickname(candidate) {
    if (!candidate?.name || candidate.isBye) return '';
    const nickname = getPlayerNickname(candidate);
    if (nickname || Object.hasOwn(candidate, 'nickname') || Object.hasOwn(candidate, 'nickName')) candidate.nickname = nickname;
    return nickname;
}

function applyModPlayerNickname(candidate, modPlayer) {
    if (!candidate || candidate.playerEditorNicknameOverride === true) return;
    if (Object.hasOwn(modPlayer, 'nickname') || Object.hasOwn(modPlayer, 'nickName')) {
        candidate.nickname = normalizePlayerNickname(Object.hasOwn(modPlayer, 'nickname') ? modPlayer.nickname : modPlayer.nickName);
    }
}

const PLAYER_NICKNAME_TEXT = Object.freeze({
    pl: { label: 'Pseudonim (opcjonalnie):', hint: 'Do 48 znaków. Pseudonim pojawi się na planszy walk-onu.', settings: 'Twój pseudonim', save: 'Zapisz pseudonim', saved: 'Pseudonim zapisany.', empty: 'Pseudonim usunięty.' },
    en: { label: 'Nickname (optional):', hint: 'Up to 48 characters. Your nickname appears on the walk-on card.', settings: 'Your nickname', save: 'Save nickname', saved: 'Nickname saved.', empty: 'Nickname removed.' },
    de: { label: 'Spitzname (optional):', hint: 'Bis zu 48 Zeichen. Dein Spitzname erscheint auf der Walk-on-Karte.', settings: 'Dein Spitzname', save: 'Spitzname speichern', saved: 'Spitzname gespeichert.', empty: 'Spitzname entfernt.' },
    nl: { label: 'Bijnaam (optioneel):', hint: 'Maximaal 48 tekens. Je bijnaam verschijnt op de walk-onkaart.', settings: 'Je bijnaam', save: 'Bijnaam opslaan', saved: 'Bijnaam opgeslagen.', empty: 'Bijnaam verwijderd.' }
});

function getPlayerNicknameText() {
    return PLAYER_NICKNAME_TEXT[typeof currentLang === 'string' ? currentLang : 'en'] || PLAYER_NICKNAME_TEXT.en;
}

function refreshPlayerNicknameUI() {
    if (typeof document === 'undefined') return;
    const text = getPlayerNicknameText();
    const labels = { 'player-nickname-label': text.label, 'player-nickname-hint': text.hint,
        'nickname-settings-label': text.settings, 'nickname-settings-hint': text.hint, 'nickname-settings-save': text.save };
    Object.entries(labels).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
    const input = document.getElementById('hub-player-nickname');
    const status = document.getElementById('nickname-settings-status');
    if (status?.dataset?.nicknameStatus) status.textContent = text[status.dataset.nicknameStatus] || '';
    // Preserve the draft when language or another hub setting changes.
    if (input && typeof player !== 'undefined' && player?.name) {
        const saved = getPlayerNickname(player);
        if (input.dataset.playerId !== player.id || input.dataset.savedNickname !== saved) {
            input.value = saved;
            input.dataset.playerId = player.id;
            input.dataset.savedNickname = saved;
            if (status) {
                status.textContent = '';
                if (status.dataset) delete status.dataset.nicknameStatus;
            }
        }
    }
}

function saveCareerPlayerNickname(event) {
    event?.preventDefault?.();
    if (typeof player === 'undefined' || !player?.name) return false;
    const input = document.getElementById('hub-player-nickname');
    if (!input) return false;
    player.nickname = normalizePlayerNickname(input.value);
    player.playerEditorNicknameOverride = true;
    input.value = player.nickname;
    input.dataset.savedNickname = player.nickname;
    input.dataset.playerId = player.id;
    const status = document.getElementById('nickname-settings-status');
    if (status) {
        const key = player.nickname ? 'saved' : 'empty';
        status.textContent = getPlayerNicknameText()[key];
        if (status.dataset) status.dataset.nicknameStatus = key;
    }
    if (typeof saveGame === 'function') saveGame(true, { immediate: true });
    return true;
}

if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', refreshPlayerNicknameUI);
}
