const { select, input, checkbox } = require('@inquirer/prompts')

let meta = {
    value: "tomar 2L de agua por dia",
    checked: false
}

let metas = [ meta ]

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta: "}) // await espera o urser dar um comando a marquina

    if(meta.length == 0) {
        console.log("A meta não pode ser vazia!")
        return
        // caso o user nn digite nada ele vai retornar ao inicio
    }

    metas.push(
        {value: meta, checked: false}
        // push ele vai empurrar os dados para o arrays
    )
}

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0){
        console.log("Nenhuma meta selecionada!")
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    console.log("meta(s) marcadas como concluída(s)")
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        console.log("não existem nenhuma meta realizadas! :(")
    }

    await select({
        message: "Metas ralizadas " + realizadas.length,
        choices: [...realizadas]
        // caso nn tenha nenhuma opção marcada, ele vai dar um problema
        // corrigir mais tarde
    })
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked != true
        //outra maneira de fazer essa comparação é:
        //(return !meta.checked) deixando o codigo mais limpo
    })

    if(abertas.length == 0) {
        console.log("não exitem metas abertas! :)")
    }

    await select({
        message: "Metas abertas " + abertas.length,
        choices: [...abertas]
    })
}

const  start = async () => {

    while(true){

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
                name: "Sair",
                value: "sair"
            }
        ]

        })

        switch (opcao){
            case "cadastrar":
                await cadastrarMeta()
                console.log(metas)
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

            case "sair":
                console.log("Até aproxima!")
                return
        }
    }
}
start()