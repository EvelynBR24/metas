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

    if(respostas.length == 0){
        console.log("Nenhuma meta selecionada!")
        return
    }

    metas.forEach((m) => {
        m.checked = false
    })

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
        message: "Metas Realizadas",
        choices: [...realizadas]
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
                name: "Listamento",
                value: "listar"
            },
            {
                name: "Metas realizadas",
                value: "realizadas"
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

            case "sair":
                console.log("Até aproxima!")
                return
        }
    }
}
start()