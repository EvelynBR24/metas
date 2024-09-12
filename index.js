const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem-Vindo ao app de Metas! ❤";

let metas

const carregarMetas = async () => {
    try{
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta: "}) // await espera o urser dar um comando a marquina

    if(meta.length == 0) {
        mensagem = "A meta não pode ser vazia!"
        return
        // caso o user nn digite nada ele vai retornar ao inicio
    }

    metas.push(
        {value: meta, checked: false}
        // push ele vai empurrar os dados para o arrays
    )

    mensagem = "Meta cadastrada com sucesso! :)"
}

const listarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    } 

    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0){
        mensagem = "Nenhuma meta selecionada!"
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = "meta(s) marcada(s) como concluída(s)"
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        mensagem = "não existem nenhuma meta realizadas! :("
        return
    }

    await select({
        message: "metas ralizadas: " + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    if(metas.length == 0) {
        mensagem = "Não exitem nenhuma meta aberta! "
        return
    }
    
    const abertas = metas.filter((meta) => {
        return meta.checked != true
        //outra maneira de fazer essa comparação é:
        //(return !meta.checked) deixando o codigo mais limpo
    })

    if(abertas.length == 0) {
        mensagem = "não exitem metas abertas! :)"
    }

    await select({
        message: "Metas abertas: " + abertas.length,
        choices: [...abertas]
    })
}

const mostrarMensagem = (() => {
    console.clear();

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
})

const removerMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Não exitem nenhuma meta para ser removida!"
        return
    }

    const metasDesmarcadas = metas.map((meta) => { //O map modifica a array original
        return {value: meta.value, checked: false}
        //outra maneira de fazer "meta.checked = false"
    })

    const itensRemovido = await checkbox({
        message: "Selecione um item para remover!",
        choices: [...metasDesmarcadas],
        instructions: false
    })

    if(itensRemovido.length == 0) {
        mensagem = "Nnehum item para remover!"
        return
    }

    itensRemovido.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "Meta(s) removidas com sucesso! :)"
}

const  start = async () => {
    await carregarMetas()

    while(true){
        mostrarMensagem()
        await salvarMetas()

        const opcao = await select({

            message: "Menu >",
            choices: [{

                name: "Cadastrar meta",
                value: "cadastrar"
            },
            {
                name: "Listar metas",
                value: "listar"
            },
            {
                name: "Metas realizadas",
                value: "realizadas"
            },
            {
                name: "Metas abertas",
                value: "abertas"
            },
            {
                name: "Remover metas",
                value: "remover"
            },
            {
                name: "Sair",
                value: "sair"
            }
        ]

        })

        switch (opcao){
            case "cadastrar":
                await cadastrarMeta()
                break

            case "listar":
                await listarMetas()
                break

            case "realizadas":
                await metasRealizadas()
                break

            case "abertas":
                await metasAbertas()
                break

            case "remover":
                await removerMetas()
                break
            
            case "sair":
                console.log("Até aproxima!")
                return
        }
    }
}
start()