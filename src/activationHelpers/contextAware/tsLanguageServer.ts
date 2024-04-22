
"use strict";
import * as vscode from "vscode";
import {
    triggerInlineCompletion,
    disableCompletion,
    provideInlineCompletionItems,
} from "../../providers/translationSuggestions/inlineCompletionsProvider";

export async function langugeServerTS (context: vscode.ExtensionContext){
    const languages = ["scripture"];
    const disposables = languages.map((language) => {
        return vscode.languages.registerInlineCompletionItemProvider(language, {
            provideInlineCompletionItems,
        });
    });
    disposables.forEach((disposable) => context.subscriptions.push(disposable));

    const commandDisposable = vscode.commands.registerCommand(
        "extension.triggerInlineCompletion",
        triggerInlineCompletion,
        triggerInlineCompletion,
    );

    // avoid sending request while typing
    let debounceTimer = setTimeout(() => {}, 0);

    vscode.workspace.onDidChangeTextDocument((e) => {
        // Clear previous debounce timer
        disableCompletion();
        clearTimeout(debounceTimer);

        // Set new debounce timer
        debounceTimer = setTimeout(() => {
            // Handle the event that the user has stopped editing the document
            const shouldTriggerInlineCompletion = e.contentChanges.length > 0;
            if (shouldTriggerInlineCompletion) {
                triggerInlineCompletion();
            }
        }, 500);
    });

    context.subscriptions.push(commandDisposable);
}