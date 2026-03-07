#!/bin/bash
# skill-creator scripts の Python 環境セットアップ

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.venv"

# Python 3 の存在確認・インストール
if ! command -v python3 &> /dev/null; then
    echo "Python 3 が見つかりません。インストールを試みます..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew &> /dev/null; then
            brew install python3
        else
            echo "Homebrew が必要です: https://brew.sh"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y python3 python3-pip python3-venv
    else
        echo "Python 3 を手動でインストールしてください: https://python.org"
        exit 1
    fi
fi

echo "Python 3 を確認: $(python3 --version)"

# 仮想環境の作成
if [ ! -d "$VENV_DIR" ]; then
    echo "仮想環境を作成中: $VENV_DIR"
    python3 -m venv "$VENV_DIR"
fi

# 依存関係のインストール
echo "依存関係をインストール中..."
"$VENV_DIR/bin/pip" install --quiet --upgrade pip
"$VENV_DIR/bin/pip" install --quiet -r "$SCRIPT_DIR/requirements.txt"

echo ""
echo "セットアップ完了！"
echo ""
echo "スクリプトを実行するには以下のいずれかを使用してください:"
echo ""
echo "  # 仮想環境を有効化してから実行"
echo "  source $VENV_DIR/bin/activate"
echo "  cd $SCRIPT_DIR && python -m scripts.run_loop --help"
echo ""
echo "  # または直接仮想環境の Python を使用"
echo "  cd $SCRIPT_DIR && $VENV_DIR/bin/python -m scripts.run_loop --help"
