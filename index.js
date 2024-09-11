const { select } = require('@inquirer/prompts')

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
                name: "Sair",
                value: "sair"
            }
        ]

        })

        switch (opcao){
            case "cadastrar":
                console.log("cadastramento")
                break
            case "listar":
                console.log("listamento")
                break
            case "sair":
                console.log("Até aproxima!")
                return
        }
    }
}
start()