#!/usr/bin/env bash
# skill-creator Python環境セットアップスクリプト
# Claude Code Actions環境・ローカル環境の両方で動作します
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.venv"
REQUIREMENTS="$SCRIPT_DIR/scripts/requirements.txt"

# Python3が利用可能か確認
if ! command -v python3 &>/dev/null; then
    echo "❌ python3が見つかりません。Pythonをインストールしてください。"
    exit 1
fi

PYTHON_VERSION=$(python3 --version 2>&1)
echo "✅ Python確認: $PYTHON_VERSION"

# 仮想環境が存在しない場合は作成
if [ ! -d "$VENV_DIR" ]; then
    echo "🔧 仮想環境を作成中: $VENV_DIR"
    python3 -m venv "$VENV_DIR"
fi

# 依存パッケージをインストール
echo "📦 依存パッケージをインストール中..."
"$VENV_DIR/bin/pip" install --quiet --upgrade pip
"$VENV_DIR/bin/pip" install --quiet -r "$REQUIREMENTS"

echo ""
echo "✅ セットアップ完了！"
echo ""
echo "スクリプトを実行するには以下のいずれかの方法を使用してください:"
echo ""
echo "  方法1: 仮想環境をアクティベートして実行"
echo "    source $VENV_DIR/bin/activate"
echo "    cd $SCRIPT_DIR && python -m scripts.run_loop --help"
echo ""
echo "  方法2: 仮想環境のPythonを直接指定"
echo "    cd $SCRIPT_DIR && $VENV_DIR/bin/python -m scripts.run_loop --help"
echo ""
echo "認証設定:"
echo "  API Key使用: export ANTHROPIC_API_KEY=sk-ant-..."
echo "  Token使用:   export ANTHROPIC_AUTH_TOKEN=your-token"
